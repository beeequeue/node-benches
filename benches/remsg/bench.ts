/* eslint-disable no-useless-computed-key */
import { Buffer } from "node:buffer"

import { barplot, bench, group, run, summary } from "mitata"

import * as new_ from "./new.ts"
import * as old from "./old.ts"

barplot(() => {
  summary(() => {
    const str = Buffer.from("Hello, World!")
    const str2 = Buffer.from(
      "Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World! Hello, World!",
    )

    group("encrypt small", () => {
      bench("old", function* () {
        yield {
          [0](): Buffer {
            return str
          },

          bench(str: Buffer) {
            old.encrypt(str)
          },
        }
      }).gc("inner")

      bench("new", function* () {
        yield {
          [0](): Buffer {
            return str
          },

          bench(str: Buffer) {
            new_.encrypt(str)
          },
        }
      }).gc("inner")
    })

    group("encrypt large", () => {
      bench("old", function* () {
        yield {
          [0](): Buffer {
            return str2
          },

          bench(str: Buffer) {
            old.encrypt(str)
          },
        }
      }).gc("inner")

      bench("new", function* () {
        yield {
          [0](): Buffer {
            return str2
          },

          bench(str: Buffer) {
            new_.encrypt(str)
          },
        }
      }).gc("inner")
    })
  })
})

await run()
