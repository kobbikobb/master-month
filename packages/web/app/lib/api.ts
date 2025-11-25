export async function getAuthHeaders(
    getToken: () => Promise<string | null>,
): Promise<HeadersInit> {
    const token = await getToken();
    if (!token) {
        return {};
    }
    return {
        Authorization: `Bearer ${token}`,
    };
}
