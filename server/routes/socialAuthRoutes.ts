import express from "express";
import {
  generateOAuthUrl,
  syncAccounts,
} from "../controller/socialAuthController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/social/:platform", protect, generateOAuthUrl);
router.get("/sync", protect, syncAccounts);

export default router;

