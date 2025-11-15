import { NavLink } from "react-router";

export const Nav = () => {
    return (
        <div className="p-4 flex justify-between max-w-5xl m-auto items-baseline">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                Master Month
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    — Create habits that stick by mastering one month at a time!
                </span>
            </h1>

            <nav className="flex gap-2">
                <NavLink to="/" className="[&.active]:font-bold">
                    Home
                </NavLink>
                <NavLink to="/goals" className="[&.active]:font-bold" end>
                    Goals
                </NavLink>
            </nav>
        </div>
    );
};
