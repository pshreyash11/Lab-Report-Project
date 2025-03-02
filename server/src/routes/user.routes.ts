import { Router } from "express";
import { loginUser, logoutUser } from "../controller/auth/login.controller.ts";
import { refreshAccessToken } from "../controller/auth/token.controller.ts";
import { registerUser } from "../controller/auth/signup.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { upload } from "../utils/multer.ts";
import { parseLabReport } from "../controller/labReportParser.ts";
import { getTestTrends } from "../controller/testTrends.ts";
import { analyzeTestTrends } from "../controller/healthInsights.ts";
import { getUserHealthReport, updateUserSymptoms, updateUserMedications, deleteHealthReport } from "../controller/healthReport.ts";

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

router.route("/analyze-trends").post(verifyJWT, analyzeTestTrends);

router.route("/health-report")
    .get(verifyJWT, getUserHealthReport)
    .delete(verifyJWT, deleteHealthReport);

router.route("/health-report/symptoms").patch(verifyJWT, updateUserSymptoms);

router.route("/health-report/medications").patch(verifyJWT, updateUserMedications);

export default router;