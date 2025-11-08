import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("goals", "routes/goals.tsx"),
] satisfies RouteConfig;
