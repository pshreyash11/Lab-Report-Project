import { Router } from "express";
import { loginUser, logoutUser } from "../controller/auth/login.controller.ts";
import { refreshAccessToken } from "../controller/auth/token.controller.ts";
import { registerUser } from "../controller/auth/signup.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { upload } from "../utils/multer.ts";
import { parseLabReport } from "../controller/labReportParser.ts";
import { getTestTrends } from "../controller/testTrends.ts";

const router = Router();

router.route("/register").post(
  upload.none(),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken); // This route is mostly hit by frontend dev.

router.route("/parse-report").post(verifyJWT, upload.single('report'),parseLabReport);

router.route("/test-trends").get(verifyJWT, getTestTrends);

export default router;