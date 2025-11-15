import { Outlet } from "react-router";
import "./app.css";
import { Nav } from "./components";
import { ErrorBoundary } from "./error-boundary";

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
