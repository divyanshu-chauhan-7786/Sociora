import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { addRealtimeClient } from "../utils/realtime.js";

interface JwtPayload {
  id: string;
}

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const token = typeof req.query.token === "string" ? req.query.token : "";

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as JwtPayload;
    const user = await User.findById(decoded.id).select("_id");

    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const removeClient = addRealtimeClient(user._id.toString(), res);
    const keepAlive = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 25_000);

    req.on("close", () => {
      clearInterval(keepAlive);
      removeClient();
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});

export default router;
