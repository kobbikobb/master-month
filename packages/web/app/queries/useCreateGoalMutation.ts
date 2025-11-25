import type { Goal } from "@master-month/core/goals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

interface CreateGoalInput {
    title: string;
    targetMonth: string;
}

interface CreateGoalResponse {
    goal: Goal;
}

export function useCreateGoalMutation() {
    const queryClient = useQueryClient();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { getAccessToken } = useAuth();

    return useMutation({
        mutationFn: async (input: CreateGoalInput): Promise<Goal> => {
            const token = await getAccessToken();
            const response = await fetch(`${apiUrl}goals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create goal");
            }

            const data: CreateGoalResponse = await response.json();
            return data.goal;
        },
        onSuccess: () => {
            // Invalidate and refetch goals list
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
}
