import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import "./app.css";
import { Nav } from "./components";
import { ErrorBoundary } from "./error-boundary";

export const errorBoundary = ErrorBoundary;

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Nav />
            <main className="pt-2">
                <Outlet />
            </main>
        </QueryClientProvider>
    );
}
