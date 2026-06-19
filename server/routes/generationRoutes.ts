import express from "express";
import { createGeneration, listGenerations } from "../controller/generationController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, listGenerations);
router.post("/", protect, createGeneration);

export default router;
