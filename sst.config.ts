/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "master-month",
            removal: input?.stage === "production" ? "retain" : "remove",
            protect: ["production"].includes(input?.stage),
            home: "aws",
        };
    },
    async run() {
        const { Bucket, GoalsTable } = await import("./infra/storage");
        const { Api } = await import("./infra/api");
        const { Web } = await import("./infra/web");

        return {
            MasterBucket: Bucket.name,
            MasterGoalsTable: GoalsTable.name,
            MasterApi: Api.url,
            MasterWeb: Web.url,
        };
    },
});
