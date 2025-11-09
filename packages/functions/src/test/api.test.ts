import { expect, test, vi } from "vitest";

// Mock SST Resource before importing the app
vi.mock("sst", () => ({
    Resource: {
        MasterBucket: {
            name: "test-bucket",
        },
    },
}));

// Now import the actual app with mocked dependencies
const { app } = await import("../api.js");

test("GET / returns message and bucket", async () => {
    const res = await app.request("/");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
        message: "Hello, world!",
        bucket: "test-bucket",
    });
});

test("GET /health returns ok status", async () => {
    const res = await app.request("/health");
    const data = (await res.json()) as { status: string };

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
});
