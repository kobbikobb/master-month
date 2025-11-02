export const Web = new sst.aws.StaticSite("MasterWeb", {
  path: "packages/web",
  build: {
    command: "npm run build",
    output: "dist",
  },
  dev: {
    command: "npm run dev",
  },
});
