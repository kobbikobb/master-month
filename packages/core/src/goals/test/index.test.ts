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
});
