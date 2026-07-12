import express from "express";
import { connectAccount, disconnectAccount, listAccounts, listPlatformPosts } from "../controller/accountController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, listAccounts);
router.get("/platform-posts", protect, listPlatformPosts);
router.post("/", protect, connectAccount);
router.delete("/:id", protect, disconnectAccount);

export default router;
