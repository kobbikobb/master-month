import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { afterEach, beforeEach } from "vitest";

export function getDynamoDBMock() {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    beforeEach(() => {
        ddbMock.reset();
    });

    afterEach(() => {
        ddbMock.restore();
    });

    return ddbMock;
}
