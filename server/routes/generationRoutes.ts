import express from "express";
import { createGeneration, deleteGeneration, listGenerations, suggestHashtags, updateGeneration } from "../controller/generationController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, listGenerations);
router.post("/", protect, createGeneration);
router.put("/:id", protect, updateGeneration);
router.delete("/:id", protect, deleteGeneration);
router.post("/hashtags", protect, suggestHashtags);

export default router;
