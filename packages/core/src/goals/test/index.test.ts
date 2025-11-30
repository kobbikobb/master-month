import {
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { describe, expect, it, vi } from "vitest";
import { sstMock } from "../../test/helpers/mocks";

vi.mock("sst", () => sstMock);

import { getDynamoDBMock } from "../../test/helpers/dynamodb";

const ddbMock = getDynamoDBMock();

import { Goals } from "../index";

describe("Goals - getGoals", () => {
    it("should get goals for a user", async () => {
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

        const goals = await Goals.getGoals("my-user-id");
        expect(goals).toHaveLength(1);
        expect(goals[0].title).toBe("Test Goal");
    });

    it("should return empty array when user has no goals", async () => {
        ddbMock.on(QueryCommand).resolves({ Items: [] });
        const goals = await Goals.getGoals("user-with-no-goals");
        expect(goals).toHaveLength(0);
    });

    it("should handle undefined Items in query response", async () => {
        ddbMock.on(QueryCommand).resolves({});
        const goals = await Goals.getGoals("my-user-id");
        expect(goals).toEqual([]);
    });

    it("should query with correct userId", async () => {
        ddbMock.on(QueryCommand).resolves({ Items: [] });
        await Goals.getGoals("test-user-123");

        const calls = ddbMock.commandCalls(QueryCommand);
        expect(calls[0].args[0].input.ExpressionAttributeValues).toEqual({
            ":userId": "test-user-123",
        });
    });
});

describe("Goals - createGoal", () => {
    it("should create a goal", async () => {
        ddbMock.on(PutCommand).resolves({});
        const goal = await Goals.createGoal(
            "my-user-id",
            "New Goal",
            "2025-12",
        );

        expect(goal.title).toBe("New Goal");
        expect(goal.targetMonth).toBe("2025-12");
        expect(goal.status).toBe("todo");
        expect(goal.userId).toBe("my-user-id");
        expect(goal.id).toBeDefined();
    });

    it("should generate unique IDs for each goal", async () => {
        ddbMock.on(PutCommand).resolves({});
        const goal1 = await Goals.createGoal("user", "Goal 1", "2025-12");
        const goal2 = await Goals.createGoal("user", "Goal 2", "2025-12");
        expect(goal1.id).not.toBe(goal2.id);
    });

    it("should call PutCommand with correct parameters", async () => {
        ddbMock.on(PutCommand).resolves({});
        await Goals.createGoal("user-123", "My Goal", "2025-12");

        const calls = ddbMock.commandCalls(PutCommand);
        expect(calls).toHaveLength(1);
        expect(calls[0].args[0].input.Item).toMatchObject({
            userId: "user-123",
            title: "My Goal",
            targetMonth: "2025-12",
            status: "todo",
        });
    });

    it("should set default status to todo", async () => {
        ddbMock.on(PutCommand).resolves({});
        const goal = await Goals.createGoal("user", "Test", "2025-12");
        expect(goal.status).toBe("todo");
    });
});

describe("Goals - findGoalById", () => {
    it("should find goal by userId and id", async () => {
        ddbMock.on(GetCommand).resolves({
            Item: {
                userId: "my-user-id",
                id: "goal-123",
                title: "Test Goal",
                targetMonth: "2025-12",
                status: "todo",
            },
        });

        const goal = await Goals.findGoalById("goal-123", "my-user-id");
        expect(goal).toBeDefined();
        expect(goal?.title).toBe("Test Goal");
        expect(goal?.id).toBe("goal-123");
    });

    it("should return null when goal not found", async () => {
        ddbMock.on(GetCommand).resolves({});
        const goal = await Goals.findGoalById("nonexistent", "my-user-id");
        expect(goal).toBeNull();
    });

    it("should use correct composite key", async () => {
        ddbMock.on(GetCommand).resolves({});
        await Goals.findGoalById("goal-456", "user-123");

        const calls = ddbMock.commandCalls(GetCommand);
        expect(calls[0].args[0].input.Key).toEqual({
            userId: "user-123",
            id: "goal-456",
        });
    });

    it("should handle Item being undefined", async () => {
        ddbMock.on(GetCommand).resolves({ Item: undefined });
        const goal = await Goals.findGoalById("user", "goal");
        expect(goal).toBeNull();
    });
});

describe("Goals - updateGoal", () => {
    it("should update goal status to done", async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: {
                userId: "my-user-id",
                id: "goal-123",
                title: "Test Goal",
                targetMonth: "2025-12",
                status: "done",
            },
        });

        const goal = await Goals.updateGoal("goal-123", "my-user-id", "done");
        expect(goal.status).toBe("done");
        expect(goal.id).toBe("goal-123");
    });

    it("should update goal status to todo", async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: {
                userId: "my-user-id",
                id: "goal-123",
                title: "Test Goal",
                targetMonth: "2025-12",
                status: "todo",
            },
        });

        const goal = await Goals.updateGoal("goal-123", "my-user-id", "todo");
        expect(goal.status).toBe("todo");
    });

    it("should use correct update expression", async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: {
                userId: "user-123",
                id: "goal-456",
                title: "Test",
                targetMonth: "2025-12",
                status: "done",
            },
        });

        await Goals.updateGoal("goal-456", "user-123", "done");

        const calls = ddbMock.commandCalls(UpdateCommand);
        const input = calls[0].args[0].input;
        expect(input.UpdateExpression).toBe("SET #status = :status");
        expect(input.ExpressionAttributeValues).toEqual({ ":status": "done" });
        expect(input.ExpressionAttributeNames).toEqual({ "#status": "status" });
    });

    it("should use correct composite key for update", async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: {
                userId: "user-123",
                id: "goal-456",
                title: "Test",
                targetMonth: "2025-12",
                status: "done",
            },
        });

        await Goals.updateGoal("goal-456", "user-123", "done");

        const calls = ddbMock.commandCalls(UpdateCommand);
        expect(calls[0].args[0].input.Key).toEqual({
            userId: "user-123",
            id: "goal-456",
        });
    });

    it("should return updated goal with ALL_NEW", async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: {
                userId: "user",
                id: "goal",
                title: "Updated Goal",
                targetMonth: "2025-12",
                status: "done",
            },
        });

        const goal = await Goals.updateGoal("user", "goal", "done");

        expect(goal).toMatchObject({
            userId: "user",
            id: "goal",
            title: "Updated Goal",
            status: "done",
        });
    });
});
