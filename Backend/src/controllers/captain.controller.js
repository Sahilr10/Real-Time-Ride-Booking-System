import { Captain } from "../models/captian.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";

const generateAccessAndRefreshTokens = async (captainId) => {
  try {
    const captain = await Captain.findById(captainId);

    if (!captain) {
      console.error("User not found for ID:", captainId);
      throw new Error("User not found");
    }

    const accessToken = captain.generateAccessToken();
    const refreshToken = captain.generateRefreshToken();

    captain.refreshToken = refreshToken;
    await captain.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

const registerCaptain = asyncHandler(async (req, res) => {
  const { email, username, password, fullName, vehicle } = req.body;

  if (
    [fullName, email, username, password, vehicle].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check if email or username already exists
  const existingCaptain = await Captain.findOne({
    $or: [{ email }, { username }, { "vehicle.plate": vehicle.plate }],
  });

  if (existingCaptain) {
    throw new ApiError(400, "Email, Username or Vehicle Plate already in use");
  }

  const newCaptain = Captain.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    vehicle,
  });

  const createdCaptain = await Captain.findById(newCaptain._id).select(
    "-password -refreshToken"
  );

  if (!createdCaptain) {
    throw new ApiError(500, "Captain creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdCaptain, "Captain created successfully"));
});

const loginCaptain = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const captain = await Captain.findOne({
    $or: [{ username }, { email }],
  });

  if (!captain) {
    throw new ApiError(404, "Captain not found");
  }

  const isPasswordValid = await captain.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    captain._id
  );

  const loggedInCaptain = await Captain.findById(captain._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          captain: loggedInCaptain,
          accessToken,
          refreshToken,
        },
        "Captain logged in successfully"
      )
    );
});

const logoutCaptain = asyncHandler(async (req, res) => {
  await Captain.findByIdAndUpdate(
    req.captain._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

const getCaptainProfile = asyncHandler(async (req, res) => {
  const captain = await Captain.findById(req.captain._id).select(
    "-password -refreshToken"
  );

  if (!captain) {
    throw new ApiError(404, "Captian not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, captain, "Captain profile fetched successfully")
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const captain = await Captain.findById(decodedToken?.captainId);

    if (!captain) {
      throw new ApiError(404, "Invalid refresh token - user not found");
    }

    if (incomingRefreshToken !== captain.refreshToken) {
      throw new ApiError(401, "RefreshToken Expired. Please login again.");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessRefreshTokens(captain._id);

    captain.refreshToken = newRefreshToken;
    await captain.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

export {
  registerCaptain,
  loginCaptain,
  generateAccessAndRefreshTokens,
  logoutCaptain,
  refreshAccessToken,
  getCaptainProfile,
};
