import express from "express";
import { clearActivityFeed, getDashboard } from "../controller/dashboardController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDashboard);
router.delete("/activity", protect, clearActivityFeed);

export default router;
