import type { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";

const KINDE_DOMAIN = process.env.KINDE_DOMAIN;

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

if (KINDE_DOMAIN) {
    JWKS = createRemoteJWKSet(
        new URL(`${KINDE_DOMAIN}/.well-known/jwks.json`),
    );
}

interface KindeTokenPayload {
    sub: string;
    email?: string;
    given_name?: string;
    family_name?: string;
}

export async function authMiddleware(c: Context, next: Next) {
    if (!KINDE_DOMAIN || !JWKS) {
        return c.json(
            { error: "Authentication not configured" },
            500,
        );
    }

    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.substring(7);

    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: KINDE_DOMAIN,
        });

        const kindePayload = payload as unknown as KindeTokenPayload;

        // Set userId in context for use in route handlers
        c.set("userId", kindePayload.sub);
        c.set("userEmail", kindePayload.email);

        await next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        return c.json({ error: "Invalid token" }, 401);
    }
}

export function optionalAuth(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    return authMiddleware(c, next);
}
