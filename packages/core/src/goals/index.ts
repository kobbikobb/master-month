export interface Goal {
    id: string;
    title: string;
    targetMonth: string;
    status: "todo" | "done";
}

export namespace Goals {
    export function getMockGoals(): Goal[] {
        return [
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
    }
}
