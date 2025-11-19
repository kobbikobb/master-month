import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { expect, it, vi } from "vitest";

// Mock SST BEFORE any imports that depend on it
vi.mock("sst", () => ({
    Resource: {
        GoalsTable: {
            name: "GoalsTable",
        },
    },
}));

import { setupDynamoDBMock } from "@master-month/core/test/helpers/dynamodb";

const ddbMock = setupDynamoDBMock();

const { app } = await import("../api.js");

it("should return goals from GET /goals", async () => {
    ddbMock.on(QueryCommand).resolves({
        Items: [
            {
                userId: "my-user-id",
                id: "1",
                title: "Test Goal",
                targetMonth: "2025-12",
                status: "todo",
            },
        ],
    });

    const res = await app.request("/goals");
    const data = (await res.json()) as {
        goals: unknown[];
    };

    expect(res.status).toBe(200);
    expect(data.goals).toBeDefined();
    expect(Array.isArray(data.goals)).toBe(true);
    expect(data.goals.length).toBeGreaterThan(0);
});
