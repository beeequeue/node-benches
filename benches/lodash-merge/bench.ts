import { createDefu, defu } from "defu"
import { merge as estoolkitMerge } from "es-toolkit"
import merge from "lodash.merge"
import { barplot, bench, group, type k_statefull, run, summary } from "mitata"

type State = k_statefull<Record<"one" | "two", { array: string[] }>>

barplot(() => {
  summary(() => {
    group("simple", () => {
      const args = [
        {
          data: [{ user: "barney" }, { user: "fred" }],
        },
        {
          data: [{ age: 36 }, { age: 40 }],
        },
      ]

      bench("lodash.merge", function* (state: State) {
        const one = state.get("one")
        const two = state.get("two")
        yield () => merge(one, two)
      })
        .gc("inner")
        .args("one", [args[0]])
        .args("two", [args[1]])

      bench("defu", function* (state: State) {
        const one = state.get("one")
        const two = state.get("two")
        yield () => defu(one, two)
      })
        .gc("inner")
        .args("one", [args[0]])
        .args("two", [args[1]])

      bench("es-toolkit", function* (state: State) {
        const one = state.get("one")
        const two = state.get("two")
        yield () => estoolkitMerge(one, two)
      })
        .gc("inner")
        .args("one", [args[0]])
        .args("two", [args[1]])
    })

    group("real", () => {
      const defu = createDefu((obj, key, value) => {
        if (!Array.isArray(value)) return

        obj[key] = value
        // oxlint-disable-next-line typescript/consistent-return
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

      bench("es-toolkit", function* (state: State) {
        const defaults = state.get("defaults")
        const withoutDefaults = state.get("withoutDefaults")
        const args = state.get("args")
        yield () => estoolkitMerge(defaults, estoolkitMerge(args, withoutDefaults))
      })
        .gc("inner")
        .args({ defaults: [defaults], withoutDefaults: [withoutDefaults], args: [args] })
    })
  })
})

await run()
