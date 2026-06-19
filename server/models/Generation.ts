import mongoose from "mongoose";

const toneValues = ["Professional", "Casual", "Friendly", "Bold", "Inspirational", "Witty"] as const;

const generationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  prompt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  tone: {
    type: String,
    enum: toneValues,
    default: "Professional",
  },
  mediaUrl: String,
}, { timestamps: true });

generationSchema.index({ user: 1, createdAt: -1 });

const Generation = mongoose.model("Generation", generationSchema);

export default Generation;
