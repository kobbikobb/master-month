import type { Goal } from "@master-month/core/goals";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

export const useGoalsQuery = () => {
    const { getAccessToken } = useAuth();

    const fetchGoals = async (): Promise<Goal[]> => {
        const token = await getAccessToken();
        const res = await fetch(`${apiUrl}goals`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to fetch goals.");
        const data = await res.json();
        return data.goals;
    };

    return useQuery({
        queryKey: ["goals"],
        queryFn: fetchGoals,
    });
};
