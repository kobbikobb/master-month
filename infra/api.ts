import { Bucket } from "./storage";

export const Api = new sst.aws.Function("MasterApi", {
	url: true,
	link: [Bucket],
	handler: "packages/functions/src/api.handler",
});
