import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { type ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const clientId = import.meta.env.VITE_KINDE_CLIENT_ID;
    const domain = import.meta.env.VITE_KINDE_DOMAIN;

    if (!clientId || !domain) {
        throw new Error("Missing Kinde environment variables.");
    }

    return (
        <KindeProvider
            clientId={clientId}
            domain={domain}
            logoutUri={window.location.origin}
            redirectUri={window.location.origin}
        >
            {children}
        </KindeProvider>
    );
};
