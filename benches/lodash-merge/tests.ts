import { describe, it } from "node:test"
import merge from "lodash.merge"
import assert from "node:assert"
import { defu } from "defu"
import { merge as estoolkitMerge } from "es-toolkit"

describe("simple", () => {
  const args = [
    {
      data: [{ user: "barney" }, { user: "fred" }],
    },
    {
      data: [{ age: 36 }, { age: 40 }],
    },
  ] as const
  const expected = {
    data: [
      { user: "barney", age: 36 },
      { user: "fred", age: 40 },
    ],
  } as const

  it("lodash", () => {
    const result = merge(...args)
    assert.deepStrictEqual(result, expected)
  })

  it("defu", () => {
    const result = defu(args[1], args[0])
    assert.deepStrictEqual(result, expected)
  })

  it("es-toolkit", () => {
    const result = estoolkitMerge(...args)
    assert.deepStrictEqual(result, expected)
  })
})

describe("complex", () => {
  const defaults = {
    log: { format: "text" },
    shard: { id: "0", publications: [] },
    port: 4848,
    tuple: ["a", "b"],
  }
  const withoutDefaults = { log: {}, shard: {} }
  const args = {
    log: { level: "info", format: "text" },
    shard: { id: "0" },
    port: 4848,
    replicaDBFile: "/tmp/replica.db",
    tuple: ["a", "b"],
  }
  const expected = {
    log: { format: "text", level: "info" },
    shard: { id: "0", publications: [] },
    port: 4848,
    replicaDBFile: "/tmp/replica.db",
    tuple: ["a", "b"],
  }

  it("lodash", () => {
    const result = merge(defaults, args, withoutDefaults)
    assert.deepStrictEqual(result, expected)
  })

  it("defu", () => {
    const result = defu(withoutDefaults, args, defaults)
    assert.deepStrictEqual(result, expected)
  })

  it("es-toolkit", () => {
    const result = estoolkitMerge(defaults, estoolkitMerge(args, withoutDefaults))
    assert.deepStrictEqual(result, expected)
  })
})
