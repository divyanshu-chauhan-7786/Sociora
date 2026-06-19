import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "Marketing Manager",
    trim: true,
  },
  company: {
    type: String,
    default: "Sociora",
    trim: true,
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  profileImageUrl: {
    type: String,
    default: "",
    trim: true,
  },
  zernioProfileId: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
