import mongoose, { Document, Schema } from "mongoose";

export interface IInboxMessage extends Document {
  user: mongoose.Types.ObjectId;
  zernioCommentId?: string;
  platform: "instagram" | "facebook" | "linkedin" | "twitter" | "youtube";
  senderName: string;
  senderAvatar?: string;
  content: string;
  postTitle?: string;
  postMediaUrl?: string;
  isRead: boolean;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  isHidden: boolean;
  isAutomated: boolean;
  matchedKeyword?: string;
  autoReplyText?: string;
  autoDmText?: string;
  accountName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inboxMessageSchema = new Schema<IInboxMessage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    zernioCommentId: {
      type: String,
      index: true,
    },
    platform: {
      type: String,
      enum: ["instagram", "facebook", "linkedin", "twitter", "youtube"],
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderAvatar: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    postTitle: {
      type: String,
      default: "Social Post Activity",
    },
    postMediaUrl: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isAutomated: {
      type: Boolean,
      default: false,
    },
    matchedKeyword: String,
    autoReplyText: String,
    autoDmText: String,
    accountName: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInboxMessage>("InboxMessage", inboxMessageSchema);
