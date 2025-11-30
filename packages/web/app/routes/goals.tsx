import { Link } from "react-router";
import { PageContainer, PageHeader } from "../components";
import { GoalsList } from "../components/GoalsList";
import { useGoalsQuery } from "../queries/useGoalsQuery";

export default function Goals() {
    const { data: goals, isLoading, isError } = useGoalsQuery();

    return (
        <PageContainer>
            <div className="flex items-center justify-between mb-8">
                <PageHeader
                    title="Your Goals"
                    subtitle="Track and manage your monthly goals."
                />
                <Link
                    to="/goals/new"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add Goal
                </Link>
            </div>
            <GoalsList goals={goals} isLoading={isLoading} isError={isError} />
        </PageContainer>
    );
}
