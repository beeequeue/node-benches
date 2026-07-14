import crypto from "node:crypto"

import { barplot, bench, group, run, summary } from "mitata"
import objectHash from "object-hash"
import { identify as objectIdentity } from "object-identity"
import { hash as ohash } from "ohash"
import { stringify as safeStableStringify } from "safe-stable-stringify"
import { getFixtures } from "tinyfixturez"

const fixtures = getFixtures(import.meta.dirname)

barplot(() => {
  summary(() => {
    group("simple", () => {
      const data = { foo: "bar", biz: "baz" }

      bench("object-hash", () => objectHash(data!)).gc("inner")
      bench("object-identity", () => crypto.hash("sha256", objectIdentity(data))).gc("inner")
      bench("ohash", () => ohash(data)).gc("inner")
      bench("safe-stable-stringify", () => crypto.hash("sha256", safeStableStringify(data)!)).gc(
        "inner",
      )
    })
    group("array", () => {
      const data = [1, 2, 3, "foo", 18n]

      bench("primitives", () =>
        crypto.hash("sha256", data.map((item) => item.toString()).join(","))).gc("inner")
      bench("object-hash", () => objectHash(data!)).gc("inner")
      bench("object-identity", () => crypto.hash("sha256", objectIdentity(data))).gc("inner")
      bench("ohash", () => ohash(data)).gc("inner")
      bench("safe-stable-stringify", () => crypto.hash("sha256", safeStableStringify(data)!)).gc(
        "inner",
      )
    })
    group("medium", () => {
      const data = { foo: { bar: { biz: "baz" } }, one: 1, two: { three: 3 } }

      bench("object-hash", () => objectHash(data!)).gc("inner")
      bench("object-identity", () => crypto.hash("sha256", objectIdentity(data))).gc("inner")
      bench("ohash", () => ohash(data)).gc("inner")
      bench("safe-stable-stringify", () => crypto.hash("sha256", safeStableStringify(data)!)).gc(
        "inner",
      )
    })
    group("pnpm lockfile", () => {
      const data = fixtures.readJson("pnpm-lock.json")

      bench("object-hash", () => objectHash(data!)).gc("inner")
      bench("object-identity", () => crypto.hash("sha256", objectIdentity(data))).gc("inner")
      bench("ohash", () => ohash(data)).gc("inner")
      bench("safe-stable-stringify", () => crypto.hash("sha256", safeStableStringify(data)!)).gc(
        "inner",
      )
    })
  })
})

await run()
