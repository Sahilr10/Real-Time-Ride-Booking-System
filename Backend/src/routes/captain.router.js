import { Router } from "express";
import { validate } from "../middlewares/validator.middleware";
import { captainRegisterValidator } from "../validators/index.js";
import { registerCaptain } from "../controllers/captain.controller.js";

const router = Router();

//public routes
router
  .route("/register")
  .post(captainRegisterValidator(), validate, registerCaptain);

export default router;
