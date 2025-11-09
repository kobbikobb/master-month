import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./_index";

test("Home page renders welcome message", () => {
    render(<Home />);
    expect(screen.getByText("This is my home!!!")).toBeDefined();
});
