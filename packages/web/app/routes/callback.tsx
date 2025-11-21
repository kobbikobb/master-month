import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getClient, setTokens } from "../lib/auth";

export default function Callback() {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
            navigate("/");
            return;
        }

        getClient()
            .exchange(code, `${window.location.origin}/callback`)
            .then((exchanged) => {
                if ("err" in exchanged && exchanged.err) {
                    console.error("Exchange error:", exchanged.err);
                    navigate("/");
                    return;
                }
                if ("tokens" in exchanged) {
                    setTokens(
                        exchanged.tokens.access,
                        exchanged.tokens.refresh,
                    );
                }
                navigate("/");
            })
            .catch((error: Error) => {
                console.error("Callback error:", error);
                navigate("/");
            });
    }, [navigate]);

    return null;
}
