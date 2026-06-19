import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platform: {
    type: String,
    enum: ["twitter", "linkedin", "facebook", "instagram", "youtube", "facebook_page", "linkedin_page", "instagram_business"],
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  zernioAccountId: {
    type: String,
  },
  accessToken: {
    type: String
  },
  tokenExpireAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["connected", "disconnected", "syncing", "error"],
    default: "connected",
  },
  audience: {
    type: String,
    default: "0",
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  postCount: {
    type: Number,
    default: 0,
  },
  zernioMetadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true
});

accountSchema.index({ user: 1, zernioAccountId: 1 }, { unique: true, sparse: true });
accountSchema.index({ user: 1, platform: 1 });

const Account = mongoose.model("Account", accountSchema);

export default Account;
