import { Api } from "./api";

export const Web = new sst.aws.React("MasterWeb", {
    path: "packages/web",
    environment: {
        VITE_API_URL: Api.url,
        VITE_KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID!,
        VITE_KINDE_DOMAIN: process.env.KINDE_DOMAIN!,
        VITE_KINDE_REDIRECT_URI: process.env.KINDE_REDIRECT_URI,
        VITE_KINDE_LOGOUT_URI: process.env.KINDE_LOGOUT_URI,
    },
    link: [Api],
    dev: {
        command: "npm run dev",
    },
    buildCommand: "npm run build",
});
