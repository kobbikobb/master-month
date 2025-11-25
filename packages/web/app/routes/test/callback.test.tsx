import { render, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Callback from "../callback";

vi.mock("react-router", () => ({
    useNavigate: vi.fn(),
}));

vi.mock("../../contexts/AuthContext", () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from "../../contexts/AuthContext";

describe("Callback", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    });

    it("should show loading state while auth is loading", () => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            loading: true,
            login: vi.fn(),
            logout: vi.fn(),
            getToken: vi.fn(),
        });

        const { getByText } = render(<Callback />);
        expect(getByText("Completing sign in...")).toBeDefined();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should navigate to home when auth finishes loading", async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: null,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
            getToken: vi.fn(),
        });

        render(<Callback />);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("should navigate to home when user is authenticated", async () => {
        vi.mocked(useAuth).mockReturnValue({
            user: { id: "test-user" },
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
            getToken: vi.fn(),
        });

        render(<Callback />);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });
});
