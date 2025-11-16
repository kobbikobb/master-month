import { useQuery } from "@tanstack/react-query";

export interface Goal {
    id: string;
    title: string;
    completed: boolean;
    targetMonth: string;
}

const fetchGoals = async (): Promise<Goal[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
        {
            id: "1",
            title: "Exercise 5 times per week",
            completed: false,
            targetMonth: "2025-01",
        },
        {
            id: "2",
            title: "Read for 30 minutes daily",
            completed: true,
            targetMonth: "2025-01",
        },
        {
            id: "3",
            title: "Learn React Query",
            completed: false,
            targetMonth: "2025-01",
        },
    ];
};

export const useGoalsQuery = () => {
    return useQuery({
        queryKey: ["goals"],
        queryFn: fetchGoals,
    });
};
