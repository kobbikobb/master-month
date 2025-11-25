import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Goal } from "@master-month/core/goals";
import { describe, expect, it, vi } from "vitest";

// Mock SST BEFORE any imports that depend on it
vi.mock("sst", () => ({
    Resource: {
        GoalsTable: {
            name: "GoalsTable",
        },
    },
}));

// Mock the auth middleware to inject userId
vi.mock("../middleware/auth.js", () => ({
    authMiddleware: vi.fn(async (c, next) => {
        c.set("userId", "test-user-id");
        await next();
    }),
}));

import { setupDynamoDBMock } from "@master-month/core/test/helpers/dynamodb";

const ddbMock = setupDynamoDBMock();

import { app } from "../api";

describe("POST /goals", () => {
    describe("validation", () => {
        it("should return 400 when title is missing", async () => {
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

        it("should return 400 when title is empty string", async () => {
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

        it("should return 400 when targetMonth is missing", async () => {
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

        it("should return 400 when targetMonth has invalid format", async () => {
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
    });

    describe("successful creation", () => {
        it("should create a new goal with valid data", async () => {
            ddbMock.on(PutCommand).resolves({});
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

        it("should trim whitespace from title", async () => {
            ddbMock.on(PutCommand).resolves({});
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
    });
});
