import { Example } from "@master-month/core/example";
import { Goals } from "@master-month/core/goals";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";
import { Resource } from "sst";
import { authMiddleware } from "./middleware/auth";

type Variables = {
    userId: string;
    userEmail?: string;
};

export const app = new Hono<{ Variables: Variables }>();

app.use(
    "*",
    cors({
        origin: (origin) => {
            if (!origin || origin.startsWith("http://localhost:5173"))
                return origin;
            if (origin.startsWith("https://")) return origin;
            return "";
        },
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    }),
);

// Protected routes - require authentication
app.use("/goals/*", authMiddleware);
app.use("/goals", authMiddleware);

app.get("/goals", async (c) => {
    const userId = c.get("userId");
    const goals = await Goals.getGoals(userId);
    return c.json({
        goals,
    });
});

app.post("/goals", async (c) => {
    const userId = c.get("userId");
    const body = await c.req.json();
    const { title, targetMonth } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return c.json({ error: "Title is required" }, 400);
    }

    if (
        !targetMonth ||
        typeof targetMonth !== "string" ||
        !/^\d{4}-\d{2}$/.test(targetMonth)
    ) {
        return c.json(
            { error: "Target month is required in YYYY-MM format" },
            400,
        );
    }

    const newGoal = await Goals.createGoal(userId, title.trim(), targetMonth);
    return c.json({ goal: newGoal }, 201);
});

// Public routes
app.get("/test", (c) => {
    return c.json({
        message: Example.hello(),
        bucket: Resource.MasterBucket.name,
    });
});

app.get("/health", (c) => {
    return c.json({ status: "ok" });
});

export const handler = handle(app);
