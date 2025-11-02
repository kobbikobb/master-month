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
    const { Bucket } = await import("./infra/storage");
    const { Api } = await import("./infra/api");
    const { Web } = await import("./infra/web");
    return {
      MyBucket: Bucket.name,
      ApiEndpoint: Api.url,
      SiteUrl: Web.url,
    };
  },
});
