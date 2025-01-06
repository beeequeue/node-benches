import { describe, expect, it } from "vitest"

import { hello } from "./index.js"

describe("test", () => {
  it("test", () => {
    expect(hello).toBe("world")
  })
})
