import { describe, expect, test } from "vitest";
import { Goals } from "../index";

describe("Goals", () => {
    describe("getMockGoals", () => {
        test("returns an array of goals", () => {
            const goals = Goals.getMockGoals();

            expect(Array.isArray(goals)).toBe(true);
            expect(goals.length).toBeGreaterThan(0);
        });

        test("each goal has required properties", () => {
            const goals = Goals.getMockGoals();

            goals.forEach((goal) => {
                expect(goal).toHaveProperty("id");
                expect(goal).toHaveProperty("title");
                expect(goal).toHaveProperty("targetMonth");
                expect(goal).toHaveProperty("status");
            });
        });

        test("status is valid", () => {
            const goals = Goals.getMockGoals();
            const validStatuses = ["todo", "done"];

            goals.forEach((goal) => {
                expect(validStatuses).toContain(goal.status);
            });
        });

        test("returns consistent data on multiple calls", () => {
            const goals1 = Goals.getMockGoals();
            const goals2 = Goals.getMockGoals();

            expect(goals1).toEqual(goals2);
        });
    });

    describe("createGoal", () => {
        test("creates a new goal with correct properties", () => {
            const title = "Test Goal";
            const targetMonth = "2025-06";

            const goal = Goals.createGoal(title, targetMonth);

            expect(goal).toHaveProperty("id");
            expect(goal.id).toBeTruthy();
            expect(goal.title).toBe(title);
            expect(goal.targetMonth).toBe(targetMonth);
            expect(goal.status).toBe("todo");
        });

        test("creates goal with unique ID", () => {
            const goal1 = Goals.createGoal("Goal 1", "2025-01");
            const goal2 = Goals.createGoal("Goal 2", "2025-02");

            expect(goal1.id).not.toBe(goal2.id);
        });

        test("adds goal to the goals list", () => {
            const initialCount = Goals.getMockGoals().length;
            Goals.createGoal("New Goal", "2025-03");
            const newCount = Goals.getMockGoals().length;

            expect(newCount).toBe(initialCount + 1);
        });

        test("created goal appears in getMockGoals", () => {
            const title = "Find Me";
            const targetMonth = "2025-04";

            const createdGoal = Goals.createGoal(title, targetMonth);
            const allGoals = Goals.getMockGoals();

            const foundGoal = allGoals.find((g) => g.id === createdGoal.id);
            expect(foundGoal).toBeDefined();
            expect(foundGoal?.title).toBe(title);
            expect(foundGoal?.targetMonth).toBe(targetMonth);
        });
    });
});
