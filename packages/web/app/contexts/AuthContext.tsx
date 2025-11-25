import { KindeProvider, useKindeAuth } from "@kinde-oss/kinde-auth-react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

interface User {
    id: string;
    email?: string;
    given_name?: string;
    family_name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
    const {
        user: kindeUser,
        isLoading,
        login,
        logout,
        getToken: kindeGetToken,
    } = useKindeAuth();

    const user: User | null = kindeUser
        ? {
              id: kindeUser.id,
              email: kindeUser.email || undefined,
              given_name: kindeUser.givenName || undefined,
              family_name: kindeUser.familyName || undefined,
          }
        : null;

    const getToken = async (): Promise<string | null> => {
        const token = await kindeGetToken();
        return token || null;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: isLoading,
                login,
                logout,
                getToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const clientId = import.meta.env.VITE_KINDE_CLIENT_ID;
    const domain = import.meta.env.VITE_KINDE_DOMAIN;
    const redirectUri = import.meta.env.VITE_KINDE_REDIRECT_URI;
    const logoutUri = import.meta.env.VITE_KINDE_LOGOUT_URI;

    if (!clientId || !domain) {
        throw new Error(
            "VITE_KINDE_CLIENT_ID and VITE_KINDE_DOMAIN must be set",
        );
    }

    return (
        <KindeProvider
            clientId={clientId}
            domain={domain}
            redirectUri={redirectUri || `${window.location.origin}/callback`}
            logoutUri={logoutUri || window.location.origin}
        >
            <AuthContextProvider>{children}</AuthContextProvider>
        </KindeProvider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }
    return context;
}
