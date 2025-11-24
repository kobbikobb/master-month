import { render, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as auth from "../../lib/auth";
import Callback from "../callback";

vi.mock("react-router", () => ({
    useNavigate: vi.fn(),
}));

const mockExchange = vi.fn();

vi.mock("../../lib/auth", () => ({
    getClient: vi.fn(() => ({
        exchange: mockExchange,
    })),
    setTokens: vi.fn(),
}));

describe("Callback", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
        delete (window as any).location;
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
        window.location = { origin: "http://localhost:3000" } as any;
    });

    it("should navigate to home when no code is provided", () => {
        window.location.search = "";
        render(<Callback />);
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should exchange code for tokens and navigate to home", async () => {
        window.location.search = "?code=test-code";

        mockExchange.mockResolvedValue({
            tokens: { access: "access-token", refresh: "refresh-token" },
            // biome-ignore lint/suspicious/noExplicitAny: Test mock
        } as any);

        render(<Callback />);

        await waitFor(() => {
            expect(mockExchange).toHaveBeenCalledWith(
                "test-code",
                "http://localhost:3000/callback",
            );
            expect(auth.setTokens).toHaveBeenCalledWith(
                "access-token",
                "refresh-token",
            );
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("should handle exchange error", async () => {
        window.location.search = "?code=test-code";
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        mockExchange.mockResolvedValue({
            err: "Invalid code",
            // biome-ignore lint/suspicious/noExplicitAny: Test mock
        } as any);

        render(<Callback />);

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalledWith(
                "Exchange error:",
                "Invalid code",
            );
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });

        consoleError.mockRestore();
    });

    it("should handle network error", async () => {
        window.location.search = "?code=test-code";
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        mockExchange.mockRejectedValue(new Error("Network error"));

        render(<Callback />);

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalledWith(
                "Callback error:",
                expect.any(Error),
            );
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });

        consoleError.mockRestore();
    });
});
