import { setupKindeEnv } from "@master-month/core/test/helpers";
import { expect, it, vi } from "vitest";

setupKindeEnv();

vi.mock("sst", () => ({
    Resource: {
        MasterBucket: {
            name: "test-bucket",
        },
    },
}));

const { app } = await import("../api.js");

it("should return message and bucket from GET /test", async () => {
    const res = await app.request("/test");
    const data = (await res.json()) as {
        message: string;
        bucket: string;
    };

    expect(res.status).toBe(200);
    expect(data).toEqual({
        message: "Hello, world!",
        bucket: "test-bucket",
    });
});
