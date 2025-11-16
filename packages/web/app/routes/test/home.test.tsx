import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../home";

test("Home page renders welcome message", () => {
    render(<Home />);
    expect(
        screen.getByText("Welcome to Master Month", { exact: false }),
    ).toBeDefined();
});
