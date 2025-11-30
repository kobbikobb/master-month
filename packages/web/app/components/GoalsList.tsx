import type { Goal } from "@master-month/core/goals";
import { Card } from ".";
import { GoalCard } from "./GoalCard";

interface GoalsListProps {
    goals: Goal[] | undefined;
    isLoading: boolean;
    isError: boolean;
}

export function GoalsList({ goals, isLoading, isError }: GoalsListProps) {
    if (isLoading) {
        return (
            <Card>
                <p className="text-gray-600 dark:text-gray-400">
                    Loading goals...
                </p>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <p className="text-red-600 dark:text-red-400">
                    Error loading goals. Please try again.
                </p>
            </Card>
        );
    }

    if (!goals || goals.length === 0) {
        return (
            <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Goals Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Start by adding your first goal to begin your monthly
                    journey.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
            ))}
        </div>
    );
}
