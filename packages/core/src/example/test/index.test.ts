import { expect, it } from "vitest";
import { Example } from "../";

it("should return hello world message", () => {
    const expected = "Hello, world!";

    expect(Example.hello()).toEqual(expected);
});
