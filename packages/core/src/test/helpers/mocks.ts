import { vi } from "vitest";

export const sstMock = {
    Resource: {
        GoalsTable: {
            name: "GoalsTable",
        },
    },
};

export const joseMock = {
    createRemoteJWKSet: vi.fn(() => ({})),
    jwtVerify: vi.fn(async () => ({
        payload: {
            sub: "test-user-id",
            email: "test@test.com",
            org_code: "test-org",
        },
    })),
};
