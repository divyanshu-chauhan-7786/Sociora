import express from "express";
import { connectAccount, disconnectAccount, listAccounts } from "../controller/accountController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.get("/", protect, listAccounts);
router.post("/", protect, connectAccount);
router.delete("/:id", protect, disconnectAccount);

export default router;
