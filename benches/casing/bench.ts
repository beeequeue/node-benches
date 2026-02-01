import { toKebabCase } from "kasi"
import kebabcase from "lodash.kebabcase"
import { barplot, bench, group, run, summary } from "mitata"

barplot(() => {
  summary(() => {
    const str = "snake_case_two_three"

    group("kebabcase", () => {
      bench("kasi", function* () {
        yield {
          [0](): string {
            return str
          },

          bench(str: string) {
            toKebabCase(str)
          },
        }
      }).gc("once")
      bench("lodash", function* () {
        yield {
          [0](): string {
            return str
          },

          bench(str: string) {
            kebabcase(str)
          },
        }
      }).gc("once")
    })
  })
})

await run()
