import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Goal } from "@master-month/core/goals";

import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock SST BEFORE importing Goals
vi.mock("sst", () => ({
    Resource: {
        GoalsTable: {
            name: "GoalsTable",
        },
    },
}));

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
    ddbMock.reset();
});

import { app } from "../api";

describe("POST /goals", () => {
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

    it("should have created goal appear in GET /goals", async () => {
        ddbMock.on(PutCommand).resolves({});

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

        // Mock the QueryCommand to return the created goal
        ddbMock.on(QueryCommand).resolves({
            Items: [goal],
        });

        const getResponse = await app.request("/goals");
        const { goals } = (await getResponse.json()) as { goals: Goal[] };

        const foundGoal = goals.find((g) => g.id === goal.id);
        expect(foundGoal).toBeDefined();
        expect(foundGoal?.title).toBe("Findable Goal");
    });
});
