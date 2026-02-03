import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import {
  captainLoginValidator,
  captainRegisterValidator,
} from "../validators/index.js";
import {
  registerCaptain,
  loginCaptain,
  logoutCaptain,
  refreshAccessToken,
  getCaptainProfile,
} from "../controllers/captain.controller.js";
import { verifyJWTCaptain } from "../middlewares/auth.middleware.js";

const router = Router();

//public routes
router
  .route("/register")
  .post(captainRegisterValidator(), validate, registerCaptain);
router.route("/login").post(captainLoginValidator(), validate, loginCaptain);
router.route("/refresh-token").post(refreshAccessToken);

//protected routes
router.route("/profile").get(verifyJWTCaptain, getCaptainProfile);
router.route("/logout").post(verifyJWTCaptain, logoutCaptain);

export default router;
