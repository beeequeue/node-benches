import { defu } from "defu"
import merge from "lodash.merge"
import { barplot, bench, type k_statefull, run, summary } from "mitata"

type State = k_statefull<Record<"one" | "two", { array: string[] }>>

barplot(() => {
  summary(() => {
    bench("lodash.merge", function* (state: State) {
      const one = state.get("one")
      const two = state.get("two")
      yield () => merge(one, two)
    })
      // .gc("inner")
      .args("one", [{ array: ["b", "c"] }])
      .args("two", [{ array: ["a"] }])
    bench("defu", function* (state: State) {
      const one = state.get("one")
      const two = state.get("two")
      yield () => defu(one, two)
    })
      // .gc("inner")
      .args("one", [{ array: ["b", "c"] }])
      .args("two", [{ array: ["a"] }])
  })
})

await run()
