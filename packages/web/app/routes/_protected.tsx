import { Outlet } from "react-router";
import { Button } from "~/components";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedLayout() {
    const { user, loading, login } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Authentication Required
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            You need to be logged in to access this page
                        </p>
                    </div>
                    <Button onClick={login}>Sign in to continue</Button>
                </div>
            </div>
        );
    }

    return <Outlet />;
}
