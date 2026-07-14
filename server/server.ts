import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors, { type CorsOptions } from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import generationRoutes from "./routes/generationRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import realtimeRoutes from "./routes/realtimeRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import socialAuthRoutes from "./routes/socialAuthRoutes.js";
import { startPostPublisher } from "./services/postPublisher.js";


const app = express();
// database connection 

await connectDB()

const normalizeOrigin = (origin: string) => origin.replace(/\/$/, "");
const configuredClientOrigins = [
    process.env.CLIENT_ORIGIN,
    ...(process.env.CLIENT_ORIGINS?.split(",") ?? []),
]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin))
    .map(normalizeOrigin);

const allowedClientOrigins = new Set(
    configuredClientOrigins.length > 0 ? configuredClientOrigins : ["http://localhost:5173"]
);

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (!origin || allowedClientOrigins.has(normalizeOrigin(origin))) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
};

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }));
app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    next();
});

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/generations', generationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/realtime', realtimeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/social-auth', socialAuthRoutes);

// globel error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const status = err?.status || 500;
    res.status(status).json({ message: err?.response?.data?.message || err?.message || "Internal Server Error" });
}); 


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

startPostPublisher();
