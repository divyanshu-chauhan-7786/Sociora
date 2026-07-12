import express from "express";
import { createMediaUploadUrl, createPost, deletePost, listPosts, publishPost, unpublishPost, updatePost } from "../controller/postController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, listPosts);
router.post("/media-upload-url", protect, createMediaUploadUrl);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/publish", protect, publishPost);
router.post("/:id/unpublish", protect, unpublishPost);

export default router;
