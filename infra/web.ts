export function createWeb(
    api: ReturnType<typeof import("sst").aws.Function>,
    kindeClientId: string,
    kindeDomain: string,
) {
    if (!kindeClientId || !kindeDomain) {
        throw new Error("Kinde Client ID and Domain must be provided.");
    }

    return new sst.aws.React("MasterWeb", {
        path: "packages/web",
        environment: {
            VITE_API_URL: api.url,
            VITE_KINDE_CLIENT_ID: kindeClientId,
            VITE_KINDE_DOMAIN: kindeDomain,
        },
        link: [api],
        dev: {
            command: "npm run dev",
        },
        buildCommand: "npm run build",
    });
}
