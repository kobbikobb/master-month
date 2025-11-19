import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export interface Goal {
    userId: string;
    id: string;
    title: string;
    targetMonth: string;
    status: "todo" | "done";
}

export namespace Goals {
    export async function getGoals(): Promise<Goal[]> {
        const result = await client.send(
            new QueryCommand({
                TableName: Resource.GoalsTable.name,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": "my-user-id",
                },
            }),
        );

        return (result.Items || []) as Goal[];
    }

    export async function createGoal(
        title: string,
        targetMonth: string,
    ): Promise<Goal> {
        const goalInput: Goal = {
            userId: "my-user-id",
            id: crypto.randomUUID(),
            title,
            targetMonth,
            status: "todo",
        };

        await client.send(
            new PutCommand({
                TableName: Resource.GoalsTable.name,
                Item: goalInput,
            }),
        );

        return goalInput;
    }
}
