import {
    index,
    layout,
    type RouteConfig,
    route,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/_protected.tsx", [
        route("goals", "routes/goals.tsx"),
        route("goals/new", "routes/goal-new.tsx"),
    ]),
    route("about", "routes/about.tsx"),
    route("callback", "routes/callback.tsx"),
    route(".well-known/*", "routes/.well-known.tsx"),
] satisfies RouteConfig;
