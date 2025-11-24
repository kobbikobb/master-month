import { issuer } from "@openauthjs/openauth";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { handle } from "hono/aws-lambda";
import { subjects } from "./subjects";

async function getUser(_email: string) {
    // TODO: Get user from your database
    return "123";
}

const app = issuer({
    storage: MemoryStorage(), // TODO: Permanent storage
    subjects,
    allow: async () => true, // TODO: Look into after moving to prod
    providers: {
        code: CodeProvider(
            CodeUI({
                sendCode: async (email, code) => {
                    console.log(email, code); // TODO: Send email via SES
                },
            }),
        ),
    },
    success: async (ctx, value) => {
        if (value.provider === "code") {
            return ctx.subject("user", {
                id: await getUser(value.claims.email),
            });
        }
        throw new Error("Invalid provider");
    },
});

export const handler = handle(app);
