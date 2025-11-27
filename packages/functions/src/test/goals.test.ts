import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { expect, it, vi } from "vitest";

// Set environment variables BEFORE imports
process.env.KINDE_DOMAIN = "https://test.kinde.com";
process.env.KINDE_CLIENT_ID = "test-client-id";

// Helper to create a valid JWT token for testing
// Our middleware only decodes (doesn't verify), so we just need valid structure
function createTestJWT(payload: object): string {
    const header = { alg: "RS256", typ: "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
        "base64url",
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        "base64url",
    );
    const signature = "test-signature";
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

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
                userId: "test-user-id",
                id: "1",
                title: "Test Goal",
                targetMonth: "2025-12",
                status: "todo",
            },
        ],
    });

    const testToken = createTestJWT({ sub: "test-user-id" });
    const res = await app.request("/goals", {
        headers: {
            Authorization: `Bearer ${testToken}`,
        },
    });
    const data = (await res.json()) as {
        goals: unknown[];
    };

    expect(res.status).toBe(200);
    expect(data.goals).toBeDefined();
    expect(Array.isArray(data.goals)).toBe(true);
    expect(data.goals.length).toBeGreaterThan(0);
});

it("should return 401 when no auth token is provided", async () => {
    const res = await app.request("/goals");
    expect(res.status).toBe(401);
});
