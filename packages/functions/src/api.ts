import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { corsMiddleware } from "./middleware/cors";
import { authRoutes } from "./routes/auth";
import { goalsRoutes } from "./routes/goals";
import { healthRoutes } from "./routes/health";

export const app = new Hono();

app.use("*", corsMiddleware);

app.route("/", goalsRoutes);
app.route("/", authRoutes);
app.route("/", healthRoutes);

export const handler = handle(app);
