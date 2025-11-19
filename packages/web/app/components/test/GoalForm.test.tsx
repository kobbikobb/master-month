import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GoalForm } from "../GoalForm";

describe("GoalForm", () => {
    it("should render form with all fields", () => {
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

    it("should call onSubmit with form data when submitted", async () => {
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

    it("should call onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        const onCancel = vi.fn();

        render(<GoalForm onSubmit={onSubmit} onCancel={onCancel} />);

        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        await user.click(cancelButton);

        expect(onCancel).toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should trim whitespace from title before submitting", async () => {
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

    it("should display error message when provided", () => {
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

    it("should disable submit button when isSubmitting is true", () => {
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

    it("should change button text when submitting", () => {
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

    it("should not submit when title is empty", async () => {
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

    it("should not submit when targetMonth is empty", async () => {
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
