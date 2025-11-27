import { useAuthCallback } from "../hooks/useAuthCallback";

export default function Callback() {
    const { error } = useAuthCallback();

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    {error
                        ? "Authentication Error"
                        : "Completing authentication..."}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {error || "Please wait while we log you in."}
                </p>
            </div>
        </div>
    );
}
