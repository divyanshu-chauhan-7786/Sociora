import { Router } from "express";
import { protect } from "./authMiddleware.js";
import {
  listInboxStream,
  replyToInboxItem,
  performItemAction,
  listAutomationRules,
  createAutomationRule,
  deleteAutomationRule,
  handleZernioWebhook,
} from "../controller/inboxController.js";

const router = Router();

// Public Real-Time Webhook for Meta / Zernio Event Notifications
router.post("/webhook", handleZernioWebhook);

// Protected App Endpoints
router.use(protect);

// Stream & Actions
router.get("/stream", listInboxStream);
router.post("/reply", replyToInboxItem);
router.post("/action", performItemAction);

// Auto-DM Keyword Automation Rules
router.get("/automations", listAutomationRules);
router.post("/automations", createAutomationRule);
router.delete("/automations/:id", deleteAutomationRule);

export default router;
