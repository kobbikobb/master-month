import type { Client } from "@openauthjs/openauth/client";
import { createClient } from "@openauthjs/openauth/client";

let _client: Client | null = null;

export function getClient() {
    if (typeof window === "undefined") {
        throw new Error("Auth client can only be used in the browser");
    }

    if (!_client) {
        const issuer = import.meta.env.VITE_AUTH_URL;
        if (!issuer) {
            throw new Error("VITE_AUTH_URL environment variable is not set");
        }
        _client = createClient({
            clientID: "web",
            issuer,
        });
    }

    return _client;
}

export function setTokens(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
}

export function getTokens() {
    return {
        access: localStorage.getItem("access_token"),
        refresh: localStorage.getItem("refresh_token"),
    };
}

export function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}
