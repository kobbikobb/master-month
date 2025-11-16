import { expect, test } from "vitest";

const { app } = await import("../api.js");

test("GET /goals should return goals", async () => {
    const res = await app.request("/goals");
    const data = (await res.json()) as {
        goals: unknown[];
    };

    expect(res.status).toBe(200);
    expect(data.goals).toBeDefined();
    expect(Array.isArray(data.goals)).toBe(true);
    expect(data.goals.length).toBeGreaterThan(0);
});
