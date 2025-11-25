import { Api } from "./api";
import { Auth } from "./auth";
import { Secrets } from "./secrets";

export const Web = new sst.aws.React("MasterWeb", {
    path: "packages/web",
    environment: {
        VITE_API_URL: Api.url,
        VITE_AUTH_URL: Auth.url,

        VITE_KINDE_CLIENT_ID: Secrets.KindeClientId.secretValue,
        VITE_KINDE_DOMAIN: Secrets.KindeDomain.secretValue,
    },
    link: [Api, Auth],
    dev: {
        command: "npm run dev",
    },
    buildCommand: "npm run build",
});
