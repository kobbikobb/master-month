import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface User {
    properties: {
        id: string;
        email?: string;
        name?: string;
        given_name?: string;
        family_name?: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
    getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const clientId = import.meta.env.VITE_KINDE_CLIENT_ID;
    const domain = import.meta.env.VITE_KINDE_DOMAIN;

    // Function to load auth from localStorage
    const loadAuthFromStorage = useCallback(() => {
        const storedToken = localStorage.getItem("kinde_token");
        const storedUser = localStorage.getItem("kinde_user");

        if (storedToken && storedUser) {
            setAccessToken(storedToken);
            setUser(JSON.parse(storedUser));
        } else {
            setAccessToken(null);
            setUser(null);
        }
        setLoading(false);
    }, []);

    // Check for existing token on mount
    useEffect(() => {
        loadAuthFromStorage();
    }, [loadAuthFromStorage]);

    // Listen for storage changes (e.g., from callback route)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "kinde_token" || e.key === "kinde_user") {
                loadAuthFromStorage();
            }
        };

        // Listen for custom event from callback
        const handleAuthUpdate = () => {
            loadAuthFromStorage();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("auth-updated", handleAuthUpdate);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("auth-updated", handleAuthUpdate);
        };
    }, [loadAuthFromStorage]);

    const login = () => {
        const redirectUri = `${window.location.origin}/callback`;
        const authUrl =
            `${domain}/oauth2/auth?` +
            new URLSearchParams({
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: "code",
                scope: "openid profile email offline",
                state: JSON.stringify({ returnTo: "/goals" }),
            });

        window.location.href = authUrl;
    };

    const logout = () => {
        localStorage.removeItem("kinde_token");
        localStorage.removeItem("kinde_user");
        setAccessToken(null);
        setUser(null);

        const logoutUrl =
            `${domain}/logout?` +
            new URLSearchParams({
                redirect: window.location.origin,
            });

        window.location.href = logoutUrl;
    };

    const getAccessToken = async () => {
        return accessToken;
    };

    const value = {
        user,
        loading,
        login,
        logout,
        getAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
