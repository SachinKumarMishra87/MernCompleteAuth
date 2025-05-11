import express from "express"
import { isAuthenticated, login, logout, register, sendOtpOnEmail, sendPasswordResetOtp, verifyEmailOtp, verifyOtpResetPassword } from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuthMiddle.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verify-otp", userAuth, sendOtpOnEmail);
router.post("/verify-acconut", userAuth, verifyEmailOtp);
router.post("/is-auth", userAuth, isAuthenticated);
router.post("/send-password-reset-otp", sendPasswordResetOtp);
router.post("/verify-password-reset-otp", verifyOtpResetPassword);

export default router