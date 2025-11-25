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
    export async function getGoals(userId: string): Promise<Goal[]> {
        const result = await client.send(
            new QueryCommand({
                TableName: Resource.GoalsTable.name,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                },
            }),
        );

        return (result.Items || []) as Goal[];
    }

    export async function createGoal(
        userId: string,
        title: string,
        targetMonth: string,
    ): Promise<Goal> {
        const goalInput: Goal = {
            userId,
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
