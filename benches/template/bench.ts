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
        yield () => asd(one, two)
      })
        .gc("inner")
        .args("one", [args[0]])
        .args("two", [args[1]])
    })
  })
})

await run()
