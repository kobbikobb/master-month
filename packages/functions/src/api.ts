import { Example } from "@master-month/core/example";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { Resource } from "sst";

export const app = new Hono();

app.get("/", (c) => {
    return c.json({
        message: Example.hello(),
        bucket: Resource.MasterBucket.name,
    });
});

app.get("/health", (c) => {
    return c.json({ status: "ok" });
});

export const handler = handle(app);
