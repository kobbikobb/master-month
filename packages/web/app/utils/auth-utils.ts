export interface TokenResponse {
    access_token: string;
    id_token: string;
}

export interface UserInfo {
    id: string;
    email: string;
    name: string;
    given_name?: string;
    family_name?: string;
}

/**
 * Kinde ID token payload structure
 */
export interface KindeIdTokenPayload {
    sub: string;
    email?: string;
    email_verified?: string;
    name?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    [key: string]: unknown; // Allow additional claims
}

/**
 * Decodes JWT payload with proper UTF-8 handling
 */
export function decodeJWT(token: string): KindeIdTokenPayload {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const jsonPayload = new TextDecoder().decode(bytes);
    return JSON.parse(jsonPayload) as KindeIdTokenPayload;
}

/**
 * Extracts user info from Kinde ID token payload
 */
export function extractUserInfo(idTokenPayload: KindeIdTokenPayload): UserInfo {
    return {
        id: idTokenPayload.sub,
        email: idTokenPayload.email || idTokenPayload.email_verified || "",
        name: idTokenPayload.name || idTokenPayload.preferred_username || "",
        given_name: idTokenPayload.given_name,
        family_name: idTokenPayload.family_name,
    };
}

/**
 * Stores authentication data in localStorage
 */
export function storeAuthData(tokens: TokenResponse): UserInfo {
    const idTokenPayload = decodeJWT(tokens.id_token);
    const userInfo = extractUserInfo(idTokenPayload);

    localStorage.setItem("kinde_token", tokens.access_token);
    localStorage.setItem(
        "kinde_user",
        JSON.stringify({ properties: userInfo }),
    );

    // Notify listeners of auth change
    window.dispatchEvent(new Event("auth-updated"));

    return userInfo;
}

/**
 * Exchanges authorization code for tokens
 */
export async function exchangeCodeForTokens(
    code: string,
): Promise<TokenResponse> {
    const apiUrl = import.meta.env.VITE_API_URL;
    const redirectUri = `${window.location.origin}/callback`;

    const response = await fetch(
        `${apiUrl}auth/callback?code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
    );

    if (!response.ok) {
        throw new Error("Token exchange failed");
    }

    return response.json();
}
