import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("goals", "routes/goals.tsx"),
    route("journal", "routes/journal.tsx"),
    route("journal/new", "routes/journal.new.tsx"),
    route("months", "routes/months.tsx"),
] satisfies RouteConfig;
