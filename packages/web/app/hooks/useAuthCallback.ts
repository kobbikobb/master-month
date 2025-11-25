import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { exchangeCodeForTokens, storeAuthData } from "../utils/auth-utils";

export function useAuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const errorParam = params.get("error");

        const redirectHome = () => setTimeout(() => navigate("/"), 3000);

        // Handle OAuth errors
        if (errorParam) {
            setError(`Authentication failed: ${errorParam}`);
            redirectHome();
            return;
        }

        // Validate code exists
        if (!code) {
            setError("No authorization code received");
            redirectHome();
            return;
        }

        // Exchange code and store tokens
        exchangeCodeForTokens(code)
            .then((tokens) => {
                storeAuthData(tokens);
                navigate("/goals", { replace: true });
            })
            .catch((err) => {
                console.error("Callback error:", err);
                setError("Failed to complete authentication");
                redirectHome();
            });
    }, [navigate]);

    return { error };
}
