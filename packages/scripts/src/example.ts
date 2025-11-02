import { Resource } from "sst";
import { Example } from "@master-month/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
