import { Hono } from "hono";
import { exchangeCodeForTokens } from "../services/auth";

export const authRoutes = new Hono();

authRoutes.get("/auth/callback", async (c) => {
    const code = c.req.query("code");
    const error = c.req.query("error");
    const redirectUri = c.req.query("redirect_uri");

    if (error) {
        console.error("OAuth error:", error);
        return c.json({ error: "Authentication failed" }, 400);
    }

    if (!code) {
        return c.json({ error: "Missing authorization code" }, 400);
    }

    if (!redirectUri) {
        return c.json({ error: "Missing redirect_uri" }, 400);
    }

    try {
        const tokens = await exchangeCodeForTokens(code, redirectUri);
        return c.json(tokens);
    } catch (error) {
        console.error("Auth callback error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});
