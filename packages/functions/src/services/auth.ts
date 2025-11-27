interface TokenResponse {
    access_token: string;
    id_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
}

export async function exchangeCodeForTokens(
    code: string,
    redirectUri: string,
): Promise<TokenResponse> {
    const tokenResponse = await fetch(
        `${process.env.KINDE_DOMAIN}/oauth2/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: process.env.KINDE_CLIENT_ID || "",
                client_secret: process.env.KINDE_CLIENT_SECRET || "",
                code,
                redirect_uri: redirectUri,
            }),
        },
    );

    if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error("Token exchange failed:", errorData);
        throw new Error("Token exchange failed");
    }

    return (await tokenResponse.json()) as TokenResponse;
}
