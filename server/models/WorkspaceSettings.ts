import mongoose from "mongoose";

const workspaceSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  timezone: {
    type: String,
    default: "Asia/Kolkata",
  },
  brandVoice: {
    type: String,
    default: "Always maintain a professional but approachable tone. Avoid buzzwords like 'synergy' or 'disrupt'. Use max 2-3 emojis per post.",
  },
  publishing: {
    urlShortening: {
      type: Boolean,
      default: true,
    },
    approvalWorkflow: {
      type: Boolean,
      default: false,
    },
  },
  notifications: {
    postFailAlerts: {
      type: Boolean,
      default: true,
    },
    weeklyDigest: {
      type: Boolean,
      default: true,
    },
  },
}, { timestamps: true });

const WorkspaceSettings = mongoose.model("WorkspaceSettings", workspaceSettingsSchema);

export default WorkspaceSettings;
