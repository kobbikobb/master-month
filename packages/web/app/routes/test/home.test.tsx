import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../home";

describe("Home", () => {
    it("should render the page header with correct title and subtitle", () => {
        render(<Home />);

        expect(screen.getByText("Welcome to Master Month")).toBeDefined();
        expect(
            screen.getByText(
                "Build lasting habits by focusing on one month at a time.",
            ),
        ).toBeDefined();
    });

    it("should render all three feature cards", () => {
        render(<Home />);

        expect(screen.getByText("Set Your Goals")).toBeDefined();
        expect(screen.getByText("Track Progress")).toBeDefined();
        expect(screen.getByText("Build Momentum")).toBeDefined();
    });

    it("should render feature card descriptions", () => {
        render(<Home />);

        expect(
            screen.getByText(
                "Define clear, achievable goals for your month-long journey.",
            ),
        ).toBeDefined();
        expect(
            screen.getByText(
                "Monitor your daily habits and stay accountable throughout the month.",
            ),
        ).toBeDefined();
        expect(
            screen.getByText(
                "Create lasting change by mastering one focused month at a time.",
            ),
        ).toBeDefined();
    });

    it("should render the component without errors", () => {
        const { container } = render(<Home />);

        expect(container.firstChild).toBeDefined();
    });
});
