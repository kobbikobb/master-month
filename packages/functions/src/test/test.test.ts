import { expect, test, vi } from "vitest";

vi.mock("sst", () => ({
    Resource: {
        MasterBucket: {
            name: "test-bucket",
        },
    },
}));

const { app } = await import("../api.js");

test("GET /test should return message and bucket", async () => {
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
