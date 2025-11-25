export const KindeDomain = new sst.Secret(
    "KindeDomain",
    process.env.KINDE_DOMAIN,
);
export const KindeClientId = new sst.Secret(
    "KindeClientId",
    process.env.KINDE_CLIENT_ID,
);
export const KindeClientSecret = new sst.Secret(
    "KindeClientSecret",
    process.env.KINDE_CLIENT_SECRET,
);

export const Secrets = [KindeDomain, KindeClientId, KindeClientSecret];
