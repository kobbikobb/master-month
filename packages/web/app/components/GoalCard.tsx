import type { Goal } from "@master-month/core/goals";
import { useUpdateGoalMutation } from "../queries/useUpdateGoalMutation";

interface GoalCardProps {
    goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
    const updateGoalMutation = useUpdateGoalMutation();

    const handleToggleComplete = async () => {
        const newStatus: "todo" | "done" =
            goal.status === "done" ? "todo" : "done";
        await updateGoalMutation.mutateAsync({
            id: goal.id,
            status: newStatus,
        });
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3
                        className={`text-xl font-semibold mb-2 transition-all ${
                            goal.status === "done"
                                ? "text-gray-500 dark:text-gray-500 line-through"
                                : "text-gray-900 dark:text-gray-100"
                        }`}
                    >
                        {goal.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {goal.targetMonth}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleToggleComplete}
                    disabled={updateGoalMutation.isPending}
                    className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 transition-all ${
                        goal.status === "done"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    } ${
                        updateGoalMutation.isPending
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                    }`}
                    aria-label={
                        goal.status === "done"
                            ? "Mark as incomplete"
                            : "Mark as complete"
                    }
                >
                    {goal.status === "done" ? "Done" : "Todo"}
                </button>
            </div>
        </div>
    );
}
