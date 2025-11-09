import { NavLink } from "react-router";

export function Nav() {
    return (
        <nav>
            <NavLink to="/" end>
                Home
            </NavLink>
            <NavLink to="/goals" end>
                Goals
            </NavLink>
        </nav>
    );
}
