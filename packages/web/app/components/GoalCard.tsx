import type { Goal } from "../queries/useGoalsQuery";
import { Card } from "./Card";

interface GoalCardProps {
    goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {goal.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {goal.targetMonth}
                    </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        goal.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                >
                    {goal.completed ? "Done" : "Todo"}
                </span>
            </div>
        </Card>
    );
}
