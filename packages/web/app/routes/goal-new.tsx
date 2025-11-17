import { useNavigate } from "react-router";
import { GoalForm, PageContainer, PageHeader } from "../components";
import { useCreateGoalMutation } from "../queries/useCreateGoalMutation";

export default function NewGoal() {
    const navigate = useNavigate();
    const createGoalMutation = useCreateGoalMutation();

    const handleSubmit = async (data: {
        title: string;
        targetMonth: string;
    }) => {
        await createGoalMutation.mutateAsync(data);
        navigate("/goals");
    };

    const handleCancel = () => {
        navigate("/goals");
    };

    return (
        <PageContainer>
            <PageHeader
                title="Add New Goal"
                subtitle="Create a new goal for your master month"
            />

            <div className="max-w-2xl mx-auto">
                <GoalForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={createGoalMutation.isPending}
                    error={
                        createGoalMutation.isError
                            ? "Failed to create goal. Please try again."
                            : undefined
                    }
                />
            </div>
        </PageContainer>
    );
}
