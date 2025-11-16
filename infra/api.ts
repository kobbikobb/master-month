import { Bucket } from "./storage";

export const Api = new sst.aws.Function("MasterApi", {
    link: [Bucket],
    handler: "packages/functions/src/api.handler",
    url: {
        cors: false,
    },
});
