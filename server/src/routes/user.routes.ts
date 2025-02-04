import { Router } from "express";
import { loginUser, logoutUser } from "../controller/auth/login.controller.ts";
import { refreshAccessToken } from "../controller/auth/token.controller.ts";
import { registerUser } from "../controller/auth/signup.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.route("/register").post(
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken); // This route is mostly hit by frontend dev.

export default router;