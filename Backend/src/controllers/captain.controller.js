import { Captain } from "../models/captian.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";

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

export { registerCaptain };
