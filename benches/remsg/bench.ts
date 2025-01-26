/* eslint-disable no-useless-computed-key */
import type { Buffer } from "node:buffer"
import fs from "node:fs"

import { barplot, bench, run, summary } from "mitata"

import { decodeMsg as bufferDecode } from "./buffer.js"
import { decodeMsg as textEncoderDecode } from "./textencoder.js"

// declare module "./buffer.js" {
//   export * from "binary-parser"
// }

barplot(() => {
  summary(() => {
    const data = fs.readFileSync("fixtures/DialogMsg.msg.539100710")

    bench("Buffer.toString", function* () {
      yield {
        [0](): Buffer {
          return data
        },

        bench(data: Buffer) {
          bufferDecode(data)
        },
      }
    }).gc("once")

    bench("TextEncoder.encode", function* () {
      yield {
        [0](): Buffer {
          return data
        },

        bench(data: Buffer) {
          textEncoderDecode(data)
        },
      }
    }).gc("once")
  })
})

await run()
