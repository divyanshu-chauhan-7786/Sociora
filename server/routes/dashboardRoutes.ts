import express from "express";
import { getDashboard } from "../controller/dashboardController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDashboard);

export default router;
