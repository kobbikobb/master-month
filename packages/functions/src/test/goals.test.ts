import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
    createTestJWT,
    getDynamoDBMock,
    joseMock,
    setupKindeEnv,
    sstMock,
} from "@master-month/core/test/helpers";
import { expect, it, vi } from "vitest";

vi.mock("sst", () => sstMock);
vi.mock("jose", () => joseMock);
setupKindeEnv();
const ddbMock = getDynamoDBMock();

const { app } = await import("../api");

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
