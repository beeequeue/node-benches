import { writeFileSync } from "node:fs"

import { createLRU } from "alleviate"
import FLRU from "flru"
// import HashLRU from "hashlru"
import { LRUCache } from "lru-cache"
// import { createLRU } from "lru.min"
import LRUMap from "lru_map"
import { barplot, bench, group, run, summary } from "mitata"
// import PicoLRU from "picolru"
import QuickLRU from "quick-lru"
import { lru as tinyLru } from "tiny-lru"
// import { lru as tinyLru11 } from "tiny-lru11"
// import { lru as tinyLru12 } from "tiny-lru12"
import { LRU as YLRU } from "ylru"

import pkgJson from "./package.json" with { type: "json" }
import { SemverLRUCache as SemverAfter } from "./vendor/semver-after.ts"

type Cache<K, V> = {
  has: (key: K) => boolean
  get: (key: K) => V | undefined
  set: (key: K, value: V) => void
  clear?: () => void
}

const caches = new Map<string, (amount: number) => Cache<any, any>>([
  [`alleviate@0:createLRU`, (max: number) => createLRU({ max })],
  // @ts-expect-error: ???
  [`flru@${pkgJson.dependencies.flru}`, (amount: number) => FLRU(amount)],
  // @ts-expect-error: ???
  // [`hashlru@${pkgJson.dependencies.hashlru}`, (amount: number) => HashLRU(amount)],
  [
    `lru-cache@${pkgJson.dependencies["lru-cache"]}`,
    (amount: number) => new LRUCache({ max: amount }),
  ],
  // [`lru.min@${pkgJson.dependencies["lru.min"]}`, (amount: number) => createLRU({ max: amount })],
  [`lru_map@${pkgJson.dependencies.lru_map}`, (amount: number) => new LRUMap.LRUMap(amount)],
  // [`picolru@${pkgJson.dependencies.picolru}`, (amount: number) => new PicoLRU({ maxSize: amount })],
  [
    `quick-lru@${pkgJson.dependencies["quick-lru"]}`,
    (amount: number) => new QuickLRU({ maxSize: amount }),
  ],
  [`semver@7.8`, (amount: number) => new SemverAfter(amount)],
  [`tiny-lru@${pkgJson.dependencies["tiny-lru"]}`, (amount: number) => tinyLru(amount)],
  // [
  //   `tiny-lru@${pkgJson.dependencies["tiny-lru11"].slice(13)}`,
  //   (amount: number) => tinyLru11(amount),
  // ],
  // [
  //   `tiny-lru@${pkgJson.dependencies["tiny-lru12"].slice(13)}`,
  //   (amount: number) => tinyLru12(amount),
  // ],
  [`ylru@${pkgJson.dependencies.ylru}`, (amount: number) => new YLRU(amount)],
])

const longKeys: string[] = []
const data: number[] = []
for (let i = 0; i < 100_000; i++) {
  const key = Math.floor(Math.random() * 100_000).toString()
  longKeys.push(`${key}${key}${key}${key}`)
  data.push(Math.floor(Math.random() * 100_000))
}

barplot(() => {
  summary(() => {
    group("INIT", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): () => Cache<string, string> {
              return () => init(10_000)
            },

            bench(c: () => Cache<string, string>) {
              return c()
            },
          }
        })
      }
    })

    group("SET STRING (10 000)", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              return init(50_000)
            },

            bench(cache: Cache<string, string>) {
              for (let i = 0; i < 10_000; i++) {
                cache.set(i.toString(), data[i]!.toString())
              }
              return cache
            },
          }
        }).gc("inner")
      }
    })

    group("SET LONG STRING (10 000)", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              return init(50_000)
            },

            bench(cache: Cache<string, string>) {
              for (let i = 0; i < 10_000; i++) {
                cache.set(longKeys[i]!.toString(), data[i]!.toString())
              }
              return cache
            },
          }
        }).gc("inner")
      }
    })

    group("GET STRING (10 000)", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              const cache = init(50_000)
              for (let i = 0; i < 10_000; i++) {
                cache.set(i.toString(), data[i]!.toString())
              }
              return cache
            },

            bench(cache: Cache<string, string>) {
              const arr = []
              for (let i = 0; i < 10_000; i++) {
                arr.push(cache.get(i.toString()))
              }
              return arr
            },
          }
        }).gc("inner")
      }
    })

    group("GET LONG STRING (10 000)", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              const cache = init(50_000)
              for (let i = 0; i < 10_000; i++) {
                cache.set(longKeys[i]!.toString(), data[i]!.toString())
              }
              return cache
            },

            bench(cache: Cache<string, string>) {
              const arr = []
              for (let i = 0; i < 10_000; i++) {
                arr.push(cache.get(longKeys[i]!.toString()))
              }
              return arr
            },
          }
        }).gc("inner")
      }
    })

    group("GET NOTHING", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              const cache = init(50_000)
              for (let i = 0; i < 10_000; i++) {
                cache.set(i.toString(), data[i]!.toString())
              }
              return cache
            },

            bench(cache: Cache<string, string>) {
              const arr = []
              for (let i = 0; i < 10_000; i++) {
                arr.push(cache.get((i * -1).toString()))
              }
              return arr
            },
          }
        }).gc("inner")
      }
    })

    group("HAS (10 000)", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              const cache = init(50_000)
              for (let i = 0; i < 10_000; i++) {
                cache.set(longKeys[i]!.toString(), data[i]!.toString())
              }
              return cache
            },

            bench(cache: Cache<string, string>) {
              const arr = []
              for (let i = 0; i < 10_000; i++) {
                arr.push(cache.has(longKeys[i]!.toString()))
              }
              return arr
            },
          }
        }).gc("inner")
      }
    })

    group("SET WITH EVICTION (10 000)", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              return init(10_000)
            },

            bench(cache: Cache<string, string>) {
              for (let i = 0; i < 10_000; i++) {
                cache.set(`evict-${longKeys[i]}`, data[i]!.toString())
              }
              return cache
            },
          }
        }).gc("inner")
      }
    })

    group("MIXED USAGE (GET, SET, EVICT, CLEAR)", () => {
      for (const [name, init] of caches.entries()) {
        bench(name, function* () {
          yield {
            0(): Cache<string, string> {
              return init(1000)
            },

            bench(cache: Cache<string, string>) {
              for (let i = 0; i < 10_000; i++) {
                if (i === 5001) {
                  cache.clear?.()
                }
                if (i % 3 === 0) {
                  cache.set(`${i % 2000}`, data[i]!.toString())
                }
                cache.get(`${i % 2000}`)
              }
              return cache
            },
          }
        }).gc("inner")
      }
    })
  })
})

const results = await run({ throw: true })
writeFileSync("bench.json", JSON.stringify(results))
