import { Bucket, GoalsTable } from "./storage";

export function createApi(
    kindeClientId: string,
    kindeDomain: string,
    kindeClientSecret: string,
) {
    if (!kindeClientId || !kindeDomain || !kindeClientSecret) {
        throw new Error(
            "Kinde Client ID, Domain, and Client Secret must be provided.",
        );
    }

    return new sst.aws.Function("MasterApi", {
        link: [Bucket, GoalsTable],
        handler: "packages/functions/src/api.handler",
        environment: {
            KINDE_CLIENT_ID: kindeClientId,
            KINDE_DOMAIN: kindeDomain,
            KINDE_CLIENT_SECRET: kindeClientSecret,
        },
        url: {
            cors: false,
        },
    });
}
