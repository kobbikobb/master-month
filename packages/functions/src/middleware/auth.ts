import type { Context, Next } from "hono";

export interface AuthContext {
    userId: string;
}

// Extend Hono's context to include our auth variables
declare module "hono" {
    interface ContextVariableMap {
        auth: AuthContext;
    }
}

interface JWTPayload {
    sub: string;
    email?: string;
    [key: string]: unknown;
}

// TODO: Use Kinde's public key
function decodeJWT(token: string): JWTPayload {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
        }
        const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString(),
        );
        return payload;
    } catch {
        throw new Error("Failed to decode JWT");
    }
}

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized: Missing or invalid token" }, 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    try {
        // Decode the JWT to get user info
        // Note: In production, you should verify the signature
        const decoded = decodeJWT(token);

        if (!decoded || !decoded.sub) {
            return c.json({ error: "Unauthorized: Invalid token" }, 401);
        }

        // Log user authentication
        console.log("User authenticated:", {
            userId: decoded.sub,
            email: decoded.email || "N/A",
            method: c.req.method,
            path: c.req.path,
            timestamp: new Date().toISOString(),
        });

        // Set the authenticated user ID in context
        c.set("auth", { userId: decoded.sub });

        await next();
    } catch (error) {
        console.error("Auth error:", error);
        return c.json(
            { error: "Unauthorized: Token verification failed" },
            401,
        );
    }
};
