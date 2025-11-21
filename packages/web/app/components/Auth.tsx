import { useAuth } from "../contexts/AuthContext";
import { Button } from "./Button";

export const Auth = () => {
    const { user, logout, login } = useAuth();
    if (user) {
        return (
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    User {user.properties.id}
                </span>
                <Button onClick={logout}>Logout</Button>
            </div>
        );
    }
    return <Button onClick={login}>Login</Button>;
};
