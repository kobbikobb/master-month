import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { GoalForm } from "../GoalForm";

describe("GoalForm", () => {
    test("renders form with all fields", () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(<GoalForm onSubmit={onSubmit} onCancel={onCancel} />);

        expect(screen.getByLabelText(/goal title/i)).toBeDefined();
        expect(screen.getByLabelText(/target month/i)).toBeDefined();
        expect(
            screen.getByRole("button", { name: /create goal/i }),
        ).toBeDefined();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeDefined();
    });

    test("calls onSubmit with form data when submitted", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        const onCancel = vi.fn();

        render(<GoalForm onSubmit={onSubmit} onCancel={onCancel} />);

        const titleInput = screen.getByLabelText(/goal title/i);
        const monthInput = screen.getByLabelText(/target month/i);
        const submitButton = screen.getByRole("button", {
            name: /create goal/i,
        });

        await user.type(titleInput, "My Test Goal");
        await user.type(monthInput, "2025-06");
        await user.click(submitButton);

        expect(onSubmit).toHaveBeenCalledWith({
            title: "My Test Goal",
            targetMonth: "2025-06",
        });
    });

    test("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(<GoalForm onSubmit={onSubmit} onCancel={onCancel} />);

        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        await user.click(cancelButton);

        expect(onCancel).toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test("trims whitespace from title before submitting", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        const onCancel = vi.fn();

        render(<GoalForm onSubmit={onSubmit} onCancel={onCancel} />);

        const titleInput = screen.getByLabelText(/goal title/i);
        const monthInput = screen.getByLabelText(/target month/i);
        const submitButton = screen.getByRole("button", {
            name: /create goal/i,
        });

        await user.type(titleInput, "  Trimmed Goal  ");
        await user.type(monthInput, "2025-06");
        await user.click(submitButton);

        expect(onSubmit).toHaveBeenCalledWith({
            title: "Trimmed Goal",
            targetMonth: "2025-06",
        });
    });

    test("displays error message when provided", () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();
        const errorMessage = "Something went wrong";

        render(
            <GoalForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                error={errorMessage}
            />,
        );

        expect(screen.getByText(errorMessage)).toBeDefined();
    });

    test("disables submit button when isSubmitting is true", () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(
            <GoalForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                isSubmitting={true}
            />,
        );

        const submitButton = screen.getByRole("button", {
            name: /creating/i,
        }) as HTMLButtonElement;
        expect(submitButton.disabled).toBe(true);
    });

    test("changes button text when submitting", () => {
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        const { rerender } = render(
            <GoalForm onSubmit={onSubmit} onCancel={onCancel} />,
        );

        expect(
            screen.getByRole("button", { name: /create goal/i }),
        ).toBeDefined();

        rerender(
            <GoalForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                isSubmitting={true}
            />,
        );

        expect(screen.getByRole("button", { name: /creating/i })).toBeDefined();
    });

    test("does not submit when title is empty", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(<GoalForm onSubmit={onSubmit} onCancel={onCancel} />);

        const monthInput = screen.getByLabelText(/target month/i);
        const submitButton = screen.getByRole("button", {
            name: /create goal/i,
        });

        await user.type(monthInput, "2025-06");
        await user.click(submitButton);

        expect(onSubmit).not.toHaveBeenCalled();
    });

    test("does not submit when targetMonth is empty", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(<GoalForm onSubmit={onSubmit} onCancel={onCancel} />);

        const titleInput = screen.getByLabelText(/goal title/i);
        const submitButton = screen.getByRole("button", {
            name: /create goal/i,
        });

        await user.type(titleInput, "My Goal");
        await user.click(submitButton);

        expect(onSubmit).not.toHaveBeenCalled();
    });
});
