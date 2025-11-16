import { expect, test } from "vitest";

const { app } = await import("../api.js");

test("GET /health should return ok status", async () => {
    const res = await app.request("/health");
    const data = (await res.json()) as { status: string };

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
});
