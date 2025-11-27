import { Example } from "@master-month/core/example";
import { Hono } from "hono";
import { Resource } from "sst";

export const healthRoutes = new Hono();

healthRoutes.get("/test", (c) => {
    return c.json({
        message: Example.hello(),
        bucket: Resource.MasterBucket.name,
    });
});

healthRoutes.get("/health", (c) => {
    return c.json({ status: "ok" });
});
