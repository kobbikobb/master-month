import { useAuth } from "../contexts/AuthContext";
import { Button } from "./Button";

export const Auth = () => {
    const { user, logout, login } = useAuth();
    if (user) {
        const displayName =
            user.properties.name ||
            user.properties.email ||
            user.properties.given_name ||
            `User ${user.properties.id.substring(0, 8)}`;

        return (
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    {displayName}
                </span>
                <Button onClick={logout}>Logout</Button>
            </div>
        );
    }
    return <Button onClick={login}>Login</Button>;
};
