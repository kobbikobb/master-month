import type { Goal } from "@master-month/core/goals";
import { useQuery } from "@tanstack/react-query";

const fetchGoals = async (): Promise<Goal[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}goals`);
    if (!res.ok) throw new Error("Failed to fetch goals");
    const data = await res.json();
    return data.goals;
};

export const useGoalsQuery = () => {
    return useQuery({
        queryKey: ["goals"],
        queryFn: fetchGoals,
    });
};
