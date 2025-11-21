import { subjects } from "@master-month/auth/client";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { clearTokens, getClient, getTokens, setTokens } from "../lib/auth";

interface User {
    type: string;
    properties: {
        id: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokens = getTokens();
        if (!tokens.access) {
            setLoading(false);
            return;
        }

        getClient()
            .verify(subjects, tokens.access, {
                refresh: tokens.refresh || undefined,
            })
            .then((verified) => {
                if (verified.err) {
                    clearTokens();
                    setUser(null);
                    return;
                }
                if (verified.tokens) {
                    setTokens(verified.tokens.access, verified.tokens.refresh);
                }
                setUser(verified.subject);
            })
            .catch(() => {
                clearTokens();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async () => {
        const { url } = await getClient().authorize(
            `${window.location.origin}/callback`,
            "code",
        );
        window.location.href = url;
    };

    const logout = () => {
        clearTokens();
        setUser(null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }
    return context;
}
