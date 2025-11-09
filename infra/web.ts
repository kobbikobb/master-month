import { Api } from "./api";

export const Web = new sst.aws.React("MasterWeb", {
	path: "packages/web",
	environment: {
		VITE_API_URL: Api.url,
	},
	link: [Api],
	dev: { command: "npm run dev" },
});
