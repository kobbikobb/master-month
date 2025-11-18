import type { Goal } from "@master-month/core/goals";
import { describe, expect, test } from "vitest";
import { app } from "../api";

describe("POST /goals", () => {
    test("creates a new goal with valid data", async () => {
        const response = await app.request("/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Test Goal",
                targetMonth: "2025-06",
            }),
        });

        expect(response.status).toBe(201);

        const data = (await response.json()) as { goal: Goal };
        expect(data).toHaveProperty("goal");
        expect(data.goal).toHaveProperty("id");
        expect(data.goal.title).toBe("Test Goal");
        expect(data.goal.targetMonth).toBe("2025-06");
        expect(data.goal.status).toBe("todo");
    });

    test("returns 400 when title is missing", async () => {
        const response = await app.request("/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                targetMonth: "2025-06",
            }),
        });

        expect(response.status).toBe(400);

        const data = (await response.json()) as { error: string };
        expect(data).toHaveProperty("error");
        expect(data.error).toContain("Title is required");
    });

    test("returns 400 when title is empty string", async () => {
        const response = await app.request("/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "   ",
                targetMonth: "2025-06",
            }),
        });

        expect(response.status).toBe(400);

        const data = (await response.json()) as { error: string };
        expect(data).toHaveProperty("error");
        expect(data.error).toContain("Title is required");
    });

    test("returns 400 when targetMonth is missing", async () => {
        const response = await app.request("/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Test Goal",
            }),
        });

        expect(response.status).toBe(400);

        const data = (await response.json()) as { error: string };
        expect(data).toHaveProperty("error");
        expect(data.error).toContain("Target month is required");
    });

    test("returns 400 when targetMonth has invalid format", async () => {
        const response = await app.request("/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Test Goal",
                targetMonth: "2025/06",
            }),
        });

        expect(response.status).toBe(400);

        const data = (await response.json()) as { error: string };
        expect(data).toHaveProperty("error");
        expect(data.error).toContain("YYYY-MM format");
    });

    test("trims whitespace from title", async () => {
        const response = await app.request("/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "  Trimmed Goal  ",
                targetMonth: "2025-06",
            }),
        });

        expect(response.status).toBe(201);

        const data = (await response.json()) as { goal: Goal };
        expect(data.goal.title).toBe("Trimmed Goal");
    });

    test("created goal appears in GET /goals", async () => {
        const createResponse = await app.request("/goals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Findable Goal",
                targetMonth: "2025-12",
            }),
        });

        const { goal } = (await createResponse.json()) as { goal: Goal };

        const getResponse = await app.request("/goals");
        const { goals } = (await getResponse.json()) as { goals: Goal[] };

        const foundGoal = goals.find((g) => g.id === goal.id);
        expect(foundGoal).toBeDefined();
        expect(foundGoal?.title).toBe("Findable Goal");
    });
});
