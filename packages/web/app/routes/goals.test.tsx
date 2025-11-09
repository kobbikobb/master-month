import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useLoaderData: () => ({
            message: "Test message",
            bucket: "test-bucket",
        }),
    };
});

const Goals = (await import("./goals")).default;

test("Goals page renders API data", () => {
    render(<Goals />);
    expect(screen.getByText("Goals Page")).toBeDefined();
    expect(screen.getByText(/Test message/)).toBeDefined();
    expect(screen.getByText(/test-bucket/)).toBeDefined();
});
