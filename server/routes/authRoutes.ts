import express from "express";
import { completeOAuthLogin, getCurrentUser, registerUser, loginUser, startOAuthLogin } from "../controller/authController.js";
import { generateOAuthUrl, syncAccounts } from "../controller/socialAuthController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.get("/oauth/:provider/start", startOAuthLogin);
router.get("/oauth/:provider/callback", completeOAuthLogin);

// Zernio Social Auth Routes
router.get("/social/:platform", protect, generateOAuthUrl);
router.get("/sync", protect, syncAccounts);

export default router;
