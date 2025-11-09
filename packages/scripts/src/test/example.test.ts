import { expect, test, vi } from "vitest";

// Mock SST Resource
vi.mock("sst", () => ({
    Resource: {
        MasterBucket: {
            name: "test-bucket",
        },
    },
}));

// Mock console.log to capture output
const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

test("example script runs without errors", async () => {
    // Import the script (this will execute it)
    await import("../example.js");

    // Verify console.log was called
    expect(consoleLogSpy).toHaveBeenCalled();

    // Verify it logged the expected message format
    const loggedMessage = consoleLogSpy.mock.calls[0][0];
    expect(loggedMessage).toContain("Hello, world!");
    expect(loggedMessage).toContain("test-bucket");

    consoleLogSpy.mockRestore();
});
