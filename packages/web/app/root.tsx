import { Outlet } from "react-router";
import { Nav } from "./nav";
import { ErrorBoundary } from "./error-boundry";

export const errorBoundary = ErrorBoundary;

export default function App() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
}
