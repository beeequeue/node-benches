/* eslint-disable no-useless-computed-key */
import { toSnakeCase, toKebabCase } from "kasi"
import kebabcase from "lodash.kebabcase"
import snakecase from "lodash.snakecase"
import { barplot, bench, group, type k_statefull, run, summary } from "mitata"

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
