import { Outlet } from "react-router";
import { ErrorBoundary } from "./error-boundry";
import { Nav } from "./nav";

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
