import type { Goal } from "@master-month/core/goals";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { getAuthHeaders } from "../lib/api";

export const useGoalsQuery = () => {
    const { getToken, user } = useAuth();

    return useQuery({
        queryKey: ["goals"],
        queryFn: async (): Promise<Goal[]> => {
            const headers = await getAuthHeaders(getToken);
            const res = await fetch(`${import.meta.env.VITE_API_URL}goals`, {
                headers,
            });
            if (!res.ok) throw new Error("Failed to fetch goals");
            const data = await res.json();
            return data.goals;
        },
        enabled: !!user,
    });
};
