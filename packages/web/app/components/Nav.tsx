import { NavLink } from "react-router";

export const Nav = () => {
    return (
        <div className="py-6 px-4 flex justify-between max-w-5xl m-auto items-baseline">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                Master Month
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    — Create habits that stick by mastering one month at a time!
                </span>
            </h1>

            <nav className="flex gap-4">
                <NavLink
                    to="/"
                    className="[&.active]:font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                    Home
                </NavLink>
                <NavLink
                    to="/goals"
                    className="[&.active]:font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    end
                >
                    Goals
                </NavLink>
            </nav>
        </div>
    );
};
