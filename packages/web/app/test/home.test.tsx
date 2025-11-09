import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../routes/home";

test("Home page renders welcome message", () => {
    render(<Home />);
    expect(screen.getByText("This is my home!!!")).toBeDefined();
});
