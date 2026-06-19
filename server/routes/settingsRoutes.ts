import express from "express";
import { getSettings, updateProfilePhoto, updateSettings } from "../controller/settingsController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);
router.post("/profile-photo", protect, updateProfilePhoto);

export default router;
