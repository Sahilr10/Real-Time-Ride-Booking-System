import { Router } from "express";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//public routes

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/refresh-token").post(refreshAccessToken);

//protected routes

router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
