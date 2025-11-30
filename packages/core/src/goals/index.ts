import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
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

    export async function findGoalById(
        id: string,
        userId: string,
    ): Promise<Goal | null> {
        const result = await client.send(
            new GetCommand({
                TableName: Resource.GoalsTable.name,
                Key: {
                    userId: userId,
                    id: id,
                },
            }),
        );

        return result.Item ? (result.Item as Goal) : null;
    }
    export async function updateGoal(
        id: string,
        userId: string,
        status: "todo" | "done",
    ): Promise<Goal> {
        const result = await client.send(
            new UpdateCommand({
                TableName: Resource.GoalsTable.name,
                Key: {
                    userId: userId,
                    id: id,
                },
                UpdateExpression: "SET #status = :status",
                ExpressionAttributeNames: {
                    "#status": "status",
                },
                ExpressionAttributeValues: {
                    ":status": status,
                },
                ReturnValues: "ALL_NEW",
            }),
        );
        return result.Attributes as Goal;
    }
}
