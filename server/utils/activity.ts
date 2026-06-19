import Activity from "../models/Activity.js";

export const recordActivity = async (payload: {
  user: string;
  type: "published" | "scheduled" | "connected" | "generated" | "failed";
  title: string;
  description: string;
  platform?: "instagram" | "facebook" | "linkedin" | "twitter" | "youtube";
}) => {
  await Activity.create(payload);
};
