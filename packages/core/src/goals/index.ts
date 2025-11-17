export interface Goal {
    id: string;
    title: string;
    targetMonth: string;
    status: "todo" | "done";
}

// In-memory store for demo purposes
const goalsStore: Goal[] = [
    {
        id: "1",
        title: "Exercise 5 times per week",
        status: "todo",
        targetMonth: "2025-01",
    },
    {
        id: "2",
        title: "Read for 30 minutes daily",
        status: "done",
        targetMonth: "2025-01",
    },
    {
        id: "3",
        title: "Learn React Query",
        status: "todo",
        targetMonth: "2025-01",
    },
];

export namespace Goals {
    export function getMockGoals(): Goal[] {
        return goalsStore;
    }

    export function createGoal(title: string, targetMonth: string): Goal {
        const newGoal: Goal = {
            id: String(Math.random()),
            title,
            targetMonth,
            status: "todo",
        };
        goalsStore.push(newGoal);
        return newGoal;
    }
}
