import { Api } from "./api";
import { Auth } from "./auth";

export const Web = new sst.aws.React("MasterWeb", {
    path: "packages/web",
    environment: {
        VITE_API_URL: Api.url,
        VITE_AUTH_URL: Auth.url,
    },
    link: [Api, Auth],
    dev: {
        command: "npm run dev",
    },
    buildCommand: "npm run build",
});
