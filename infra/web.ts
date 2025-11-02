import { Api } from "./api";

export const Web = new sst.aws.React("MasterWeb", {
  path: "packages/web",
  environment: {
    API_URL: Api.url,
  },
  link: [Api],
});
