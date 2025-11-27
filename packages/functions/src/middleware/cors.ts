import { cors } from "hono/cors";

export const corsMiddleware = cors({
    origin: (origin) => {
        if (!origin || origin.startsWith("http://localhost:5173"))
            return origin;
        if (origin.startsWith("https://")) return origin;
        return "";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
});
