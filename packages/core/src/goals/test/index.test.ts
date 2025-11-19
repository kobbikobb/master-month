import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
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

import { Goals } from "../index";

describe("Goals", () => {
    it("should get goals", async () => {
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

        const goals = await Goals.getGoals();

        expect(goals).toHaveLength(1);
        expect(goals[0].title).toBe("Test Goal");
    });

    it("should add goal", async () => {
        ddbMock.on(PutCommand).resolves({});

        const goal = await Goals.createGoal("New Goal", "2025-12");

        expect(goal.title).toBe("New Goal");
        expect(goal.targetMonth).toBe("2025-12");
        expect(goal.status).toBe("todo");
        expect(ddbMock.commandCalls(PutCommand)).toHaveLength(1);
    });
});
