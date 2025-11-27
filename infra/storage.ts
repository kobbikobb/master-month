export const Bucket = new sst.aws.Bucket("MasterBucket", {
    access: "public",
});

export const GoalsTable = new sst.aws.Dynamo("GoalsTable", {
    fields: {
        userId: "string",
        id: "string",
        targetMonth: "string",
    },
    primaryIndex: { hashKey: "userId", rangeKey: "id" },
    globalIndexes: {
        StatusIndex: { hashKey: "userId", rangeKey: "targetMonth" },
    },
});
