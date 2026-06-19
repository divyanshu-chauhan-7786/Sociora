import mongoose from "mongoose";

const platformValues = ["instagram", "facebook", "linkedin", "twitter", "youtube"] as const;
const statusValues = ["scheduled", "publishing", "published", "failed", "draft"] as const;

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  platforms: {
    type: [String],
    enum: platformValues,
    required: true,
    validate: {
      validator: (value: string[]) => Array.isArray(value) && value.length > 0,
      message: "At least one platform is required",
    },
  },
  scheduledDate: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: statusValues,
    default: "scheduled",
    index: true,
  },
  mediaUrl: String,
  mediaName: String,
  mediaType: {
    type: String,
    enum: ["image", "video"],
  },
  source: {
    type: String,
    enum: ["manual", "ai"],
    default: "manual",
  },
  publishAttemptedAt: Date,
  publishedAt: Date,
  publishError: String,
  zernioPostId: String,
  zernioResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

postSchema.index({ user: 1, status: 1, scheduledDate: 1, scheduledTime: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
