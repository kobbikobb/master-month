import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Home from "../home";

it("should render home page with welcome message", () => {
    render(<Home />);
    expect(
        screen.getByText("Welcome to Master Month", { exact: false }),
    ).toBeDefined();
});
