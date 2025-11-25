import { Goals } from "@master-month/core/goals";
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

export const goalsRoutes = new Hono();

goalsRoutes.get("/goals", authMiddleware, async (c) => {
    const { userId } = c.get("auth");
    const goals = await Goals.getGoals(userId);
    return c.json({
        goals,
    });
});

goalsRoutes.post("/goals", authMiddleware, async (c) => {
    const { userId } = c.get("auth");
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
