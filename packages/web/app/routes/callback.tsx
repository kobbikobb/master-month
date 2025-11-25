import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Callback() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            // Once Kinde finishes processing, redirect to home
            navigate("/");
        }
    }, [loading, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Completing sign in...
                </p>
            </div>
        </div>
    );
}
