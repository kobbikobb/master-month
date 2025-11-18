import { useState } from "react";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import { Input } from "./Input";

interface GoalFormProps {
    onSubmit: (data: { title: string; targetMonth: string }) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
    error?: string;
}

export function GoalForm({
    onSubmit,
    onCancel,
    isSubmitting = false,
    error,
}: GoalFormProps) {
    const [title, setTitle] = useState("");
    const [targetMonth, setTargetMonth] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !targetMonth) {
            return;
        }

        await onSubmit({
            title: title.trim(),
            targetMonth,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="title"
                label="Goal Title"
                type="text"
                value={title}
                onChange={setTitle}
                placeholder="e.g., Exercise 5 times per week"
                required
            />

            <Input
                id="targetMonth"
                label="Target Month"
                type="month"
                value={targetMonth}
                onChange={setTargetMonth}
                required
            />

            {error && <ErrorMessage message={error} />}

            <div className="flex gap-4">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    fullWidth
                >
                    {isSubmitting ? "Creating..." : "Create Goal"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    fullWidth
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
