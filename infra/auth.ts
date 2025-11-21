export const Auth = new sst.aws.Auth("MasterAuth", {
    issuer: "packages/auth/src/index.handler",
});
