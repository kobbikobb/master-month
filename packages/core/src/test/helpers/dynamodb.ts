import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { afterEach, beforeEach } from "vitest";

/**
 * Creates and returns a DynamoDB DocumentClient mock.
 *
 * Important: vi.mock("sst") must be called at the top level of your test file
 * BEFORE importing any modules that depend on SST Resources.
 *
 * @example
 * ```ts
 * import { vi } from "vitest";
 *
 * vi.mock("sst", () => ({
 *   Resource: {
 *     GoalsTable: { name: "GoalsTable" }
 *   }
 * }));
 *
 * const ddbMock = setupDynamoDBMock();
 * import { Goals } from "../index"; // Import AFTER mock setup
 * ```
 */
export function setupDynamoDBMock() {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    beforeEach(() => {
        ddbMock.reset();
    });

    afterEach(() => {
        ddbMock.restore();
    });

    return ddbMock;
}
