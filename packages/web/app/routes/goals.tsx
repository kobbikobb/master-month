import { Card, PageContainer, PageHeader } from "../components";
import { useGoalsQuery } from "../queries/useGoalsQuery";

export default function Goals() {
    const { data: goals, isLoading, isError } = useGoalsQuery();

    return (
        <PageContainer>
            <PageHeader
                title="Your Goals"
                subtitle="Track and manage your monthly goals."
            />

            <div className="space-y-6">
                {isLoading && (
                    <Card>
                        <p className="text-gray-600 dark:text-gray-400">
                            Loading goals...
                        </p>
                    </Card>
                )}

                {isError && (
                    <Card>
                        <p className="text-red-600 dark:text-red-400">
                            Error loading goals. Please try again.
                        </p>
                    </Card>
                )}

                {!isLoading &&
                    !isError &&
                    goals &&
                    goals.length > 0 &&
                    goals.map((goal) => (
                        <Card key={goal.id}>
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
                                        goal.status === "done"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                                    }`}
                                >
                                    {goal.status === "done" ? "Done" : "Todo"}
                                </span>
                            </div>
                        </Card>
                    ))}

                {!isLoading && !isError && (!goals || goals.length === 0) && (
                    <Card>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Goals Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start by adding your first goal to begin your
                            monthly journey.
                        </p>
                    </Card>
                )}
            </div>
        </PageContainer>
    );
}
