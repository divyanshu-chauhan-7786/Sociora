import express from "express";
import { createGeneration, listGenerations, suggestHashtags } from "../controller/generationController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, listGenerations);
router.post("/", protect, createGeneration);
router.post("/hashtags", protect, suggestHashtags);

export default router;
