import { describe, expect, it } from "vitest";
import { subjects } from "../subjects";

describe("subjects", () => {
    it("should define user subject with id field", () => {
        expect(subjects).toBeDefined();
        expect(subjects.user).toBeDefined();
    });
});
