import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("goals", "routes/goals.tsx"),
    route("goals/new", "routes/goal-new.tsx"),
    route("about", "routes/about.tsx"),
] satisfies RouteConfig;
