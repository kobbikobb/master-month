import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Goal } from "@master-month/core/goals";
import {
    createTestJWT,
    getDynamoDBMock,
    joseMock,
    setupKindeEnv,
    sstMock,
} from "@master-month/core/test/helpers";
import { describe, expect, it, vi } from "vitest";

vi.mock("sst", () => sstMock);
vi.mock("jose", () => joseMock);
setupKindeEnv();
const ddbMock = getDynamoDBMock();

const { app } = await import("../api");

describe("POST /goals", () => {
    describe("validation", () => {
        it("should return 400 when title is missing", async () => {
            const response = await app.request("/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${createTestJWT({ sub: "test-user-id" })}`,
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
                    Authorization: `Bearer ${createTestJWT({ sub: "test-user-id" })}`,
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
                    Authorization: `Bearer ${createTestJWT({ sub: "test-user-id" })}`,
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
                    Authorization: `Bearer ${createTestJWT({ sub: "test-user-id" })}`,
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

        it("should return 401 when no auth token is provided", async () => {
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

            expect(response.status).toBe(401);
        });
    });

    describe("successful creation", () => {
        it("should create a new goal with valid data", async () => {
            ddbMock.on(PutCommand).resolves({});
            const response = await app.request("/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${createTestJWT({ sub: "test-user-id" })}`,
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
            expect(data.goal.userId).toBe("test-user-id");
        });

        it("should trim whitespace from title", async () => {
            ddbMock.on(PutCommand).resolves({});
            const response = await app.request("/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${createTestJWT({ sub: "test-user-id" })}`,
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
