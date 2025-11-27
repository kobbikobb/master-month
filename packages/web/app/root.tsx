import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";
import { Nav } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorBoundary } from "./error-boundary";

export const errorBoundary = ErrorBoundary;

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Script needed to prevent theme flash on page load
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                const stored = localStorage.getItem('theme');
                                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                const theme = stored || (prefersDark ? 'dark' : 'light');
                                document.documentElement.classList.toggle('dark', theme === 'dark');
                            })();
                        `,
                    }}
                />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <ThemeProvider>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <Nav />
                    <main className="pt-2">
                        <Outlet />
                    </main>
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
