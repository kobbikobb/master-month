import { Card, GoalCard, PageContainer, PageHeader } from "../components";
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
                    goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}

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
