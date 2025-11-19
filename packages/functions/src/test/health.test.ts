import { expect, it } from "vitest";

const { app } = await import("../api.js");

it("should return ok status from GET /health", async () => {
    const res = await app.request("/health");
    const data = (await res.json()) as { status: string };

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
});
