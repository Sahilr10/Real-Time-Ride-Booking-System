import { Router } from "express";
import { userRegisterValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

//public routes

router.route("/register").post(
    userRegisterValidator(),
    validate,
    registerUser
);


export default router;