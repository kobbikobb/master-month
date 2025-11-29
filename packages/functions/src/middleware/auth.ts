import type { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AuthContext {
    userId: string;
    email?: string;
    orgCode?: string;
}

// Extend Hono's context to include our auth variables
declare module "hono" {
    interface ContextVariableMap {
        auth: AuthContext;
    }
}

interface KindeJWTPayload {
    sub: string;
    email?: string;
    org_code?: string;
    aud: string[];
    iss: string;
    [key: string]: unknown;
}

// Cache the JWKS for better performance
const JWKS = createRemoteJWKSet(
    new URL(`${process.env.KINDE_DOMAIN}/.well-known/jwks.json`),
);

async function verifyKindeToken(token: string): Promise<KindeJWTPayload> {
    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: process.env.KINDE_DOMAIN,
            audience: process.env.KINDE_AUDIENCE, // Your API identifier
        });

        return payload as KindeJWTPayload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        throw new Error("Invalid or expired token");
    }
}

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized: Missing or invalid token" }, 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    try {
        const decoded = await verifyKindeToken(token);

        console.log("Decoded JWT payload:", decoded);

        c.set("auth", {
            userId: decoded.sub,
            email: decoded.email,
            orgCode: decoded.org_code,
        });

        await next();
    } catch (error) {
        console.error("Auth error:", error);
        return c.json(
            { error: "Unauthorized: Token verification failed" },
            401,
        );
    }
};
