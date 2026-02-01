import type { Buffer } from "node:buffer"
import fs from "node:fs"

import { barplot, bench, run, summary } from "mitata"

import { decodeMsg as arraybufferDecode } from "./versions/arraybuffer-2.0.2/index.mjs"
import { decodeMsg as bufferDecode } from "./versions/buffer-2.0.5/index.mjs"
import { decodeMsg as fixedDecode } from "./versions/buffer-quick/index.mjs"

barplot(() => {
  summary(() => {
    const data = fs.readFileSync("fixtures/DialogMsg.msg.539100710")

    bench("Fixed", function* () {
      yield {
        [0](): Buffer {
          return data
        },

        bench(data: Buffer) {
          fixedDecode(data)
        },
      }
    }).gc("once")

    bench("Original", function* () {
      yield {
        [0](): Buffer {
          return data
        },

        bench(data: Buffer) {
          bufferDecode(data)
        },
      }
    }).gc("once")

    bench("Original", function* () {
      yield {
        [0](): Buffer {
          return data
        },

        bench(data: Buffer) {
          arraybufferDecode(data)
        },
      }
    }).gc("once")
  })
})

await run()
