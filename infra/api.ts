import { Bucket, GoalsTable } from "./storage";

export const Api = new sst.aws.Function("MasterApi", {
    link: [Bucket, GoalsTable],
    handler: "packages/functions/src/api.handler",
    environment: {
        KINDE_DOMAIN: process.env.KINDE_DOMAIN!,
    },
    url: {
        cors: false,
    },
});
