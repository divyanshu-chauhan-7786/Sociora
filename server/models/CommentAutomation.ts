import mongoose, { Document, Schema } from "mongoose";

export interface ICommentAutomation extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  platform: "instagram" | "facebook" | "all";
  keyword: string;
  replyText: string;
  dmText: string;
  isActive: boolean;
  triggerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentAutomationSchema = new Schema<ICommentAutomation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: ["instagram", "facebook", "all"],
      default: "all",
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    replyText: {
      type: String,
      required: true,
      trim: true,
    },
    dmText: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    triggerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICommentAutomation>("CommentAutomation", commentAutomationSchema);
