import { Outlet } from "react-router";
import "./app.css";
import { ErrorBoundary } from "./error-boundary";
import { Nav } from "./nav";

export const errorBoundary = ErrorBoundary;

export default function App() {
    return (
        <>
            <Nav />
            <main className="pt-2">
                <Outlet />
            </main>
        </>
    );
}
