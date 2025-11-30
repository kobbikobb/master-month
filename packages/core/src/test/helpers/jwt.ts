export function createTestJWT(payload: object): string {
    const header = { alg: "RS256", typ: "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
        "base64url",
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        "base64url",
    );
    const signature = "test-signature";
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}
