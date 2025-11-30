import type { Goal } from "@master-month/core/goals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";

interface UpdateGoalInput {
    id: string;
    status: "todo" | "done";
}

interface UpdateGoalResponse {
    goal: Goal;
}

interface MutationContext {
    previousGoals: Goal[] | undefined;
}

export function useUpdateGoalMutation() {
    const queryClient = useQueryClient();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { getAccessToken } = useAuth();

    return useMutation<Goal, Error, UpdateGoalInput, MutationContext>({
        mutationFn: async (input: UpdateGoalInput): Promise<Goal> => {
            const token = await getAccessToken();
            const response = await fetch(`${apiUrl}/goals/${input.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: input.status }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update goal");
            }

            const data: UpdateGoalResponse = await response.json();
            return data.goal;
        },

        onMutate: async (input: UpdateGoalInput) => {
            await queryClient.cancelQueries({ queryKey: ["goals"] });

            const previousGoals = queryClient.getQueryData<Goal[]>(["goals"]);

            queryClient.setQueryData<Goal[]>(["goals"], (old) => {
                if (!old) return old;
                return old.map((goal) =>
                    goal.id === input.id
                        ? { ...goal, status: input.status }
                        : goal,
                );
            });

            return { previousGoals };
        },

        onError: (error, input, context) => {
            if (context?.previousGoals) {
                queryClient.setQueryData(["goals"], context.previousGoals);
            }
            console.error("Failed to update goal:", error, input);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
}
