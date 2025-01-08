import { createDefu, defu } from "defu"
import merge from "lodash.merge"
import { barplot, bench, group, type k_statefull, run, summary } from "mitata"

type State = k_statefull<Record<"one" | "two", { array: string[] }>>

barplot(() => {
  summary(() => {
    group("simple", () => {
      bench("lodash.merge", function* (state: State) {
        const one = state.get("one")
        const two = state.get("two")
        yield () => merge(one, two)
      })
        .gc("inner")
        .args("one", [{ array: ["b", "c"] }])
        .args("two", [{ array: ["a"] }])

      bench("defu", function* (state: State) {
        const one = state.get("one")
        const two = state.get("two")
        yield () => defu(one, two)
      })
        .gc("inner")
        .args("one", [{ array: ["b", "c"] }])
        .args("two", [{ array: ["a"] }])
    })

    group("real", () => {
      const defu = createDefu((obj, key, value) => {
        if (!Array.isArray(value)) return

        obj[key] = value
        return true
      })

      type State = k_statefull<{
        defaults: object
        withoutDefaults: object
        args: object
      }>

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

      bench("lodash.merge", function* (state: State) {
        const defaults = state.get("defaults")
        const withoutDefaults = state.get("withoutDefaults")
        const args = state.get("args")
        yield () => merge(defaults, args, withoutDefaults)
      })
        .gc("inner")
        .args({ defaults: [defaults], withoutDefault: [withoutDefaults], args: [args] })

      bench("defu", function* (state: State) {
        const defaults = state.get("defaults")
        const withoutDefaults = state.get("withoutDefaults")
        const args = state.get("args")
        yield () => defu(withoutDefaults, args, defaults)
      })
        .gc("inner")
        .args({ defaults: [defaults], withoutDefaults: [withoutDefaults], args: [args] })
    })
  })
})

await run()
