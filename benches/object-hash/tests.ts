import assert from "node:assert"
import { hash } from "node:crypto"
import { describe, it } from "node:test"

import objectHash from "object-hash"
import { identify as objectIdentity } from "object-identity"
import { hash as ohash } from "ohash"
import { stringify as safeStableStringify } from "safe-stable-stringify"
import { getFixtures } from "tinyfixturez"

const fixtures = getFixtures(import.meta.dirname)

describe("lockfile", () => {
  const data = fixtures.readJson("pnpm-lock.json")

  it("object-hash", () => {
    assert.strictEqual(objectHash(data!), "3cb497faddbc3c60d0e39adfc6a083eecf62d859")
  })
  it("object-identity", () => {
    assert.strictEqual(
      hash("sha256", objectIdentity(data)),
      "6f3aa08f66b828a5159f71ae879adcd6cad2ff61decdd2537d26fdcc351fc0e4",
    )
  })
  it("ohash", () => {
    assert.strictEqual(ohash(data), "_KkkNXDsHbV9eWl8CZzHufxDDBdiSo62XAOu43onTGw")
  })
  it("safe-stable-stringify", () => {
    assert.strictEqual(
      hash("sha256", safeStableStringify(data)!),
      "0efdbb6b401bd84a8a8c5edd0ce51c942ad3c1bf7180620e8cb7d6e9599885f1",
    )
  })
})
