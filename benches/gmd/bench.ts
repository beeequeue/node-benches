/* eslint-disable no-useless-computed-key */
import fs from "node:fs"

import { barplot, bench, run, summary } from "mitata"

import { encodeGmd as allocEncode, decodeGmd } from "./alloc.js"
import { encodeGmd as expandEncode } from "./expand.js"

const data = decodeGmd(fs.readFileSync("fixtures/armorSeriesData_eng.gmd"))

barplot(() => {
  summary(() => {
    bench("allocate then fill", function* () {
      yield {
        [0]() {
          return data
        },

        bench(data: any) {
          return allocEncode(data)
        },
      }
    })

    bench("expand", function* () {
      yield {
        [0]() {
          return data
        },

        bench(data: any) {
          return expandEncode(data)
        },
      }
    })
  })
})

await run()
