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
        const { GoalsTable } = await import("./infra/storage");
        const { createApi } = await import("./infra/api");
        const { createWeb } = await import("./infra/web");

        const Api = await createApi(
            process.env.KINDE_CLIENT_ID,
            process.env.KINDE_DOMAIN,
            process.env.KINDE_CLIENT_SECRET,
        );

        const Web = await createWeb(
            Api,
            process.env.KINDE_CLIENT_ID,
            process.env.KINDE_DOMAIN,
        );

        return {
            MasterGoalsTable: GoalsTable.name,
            MasterApi: Api.url,
            MasterWeb: Web.url,
        };
    },
});
