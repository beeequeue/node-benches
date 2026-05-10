import { kebabCase as estoolkitKebabCase, snakeCase as esToolkitSnakeCase } from "es-toolkit/string"
import { toKebabCase as kasiKebabCase, toSnakeCase as kasiSnakeCase } from "kasi"
import kebabcase from "lodash.kebabcase"
import snakecase from "lodash.snakecase"
import { barplot, bench, group, run, summary } from "mitata"

barplot(() => {
  summary(() => {
    group("kebabcase", () => {
      const str = "snake_case_two_three"

      bench("kasi", function* () {
        yield {
          [0](): string {
            return str
          },

          bench(str: string) {
            kasiKebabCase(str)
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

      bench("es-toolkit", function* () {
        yield {
          [0](): string {
            return str
          },

          bench(str: string) {
            estoolkitKebabCase(str)
          },
        }
      }).gc("once")
    })

    group("snakecase", () => {
      const str = "SnakeCaseOneTwoThree"

      bench("kasi", function* () {
        yield {
          [0](): string {
            return str
          },

          bench(str: string) {
            kasiSnakeCase(str)
          },
        }
      }).gc("once")

      bench("lodash", function* () {
        yield {
          [0](): string {
            return str
          },

          bench(str: string) {
            snakecase(str)
          },
        }
      }).gc("once")

      bench("es-toolkit", function* () {
        yield {
          [0](): string {
            return str
          },

          bench(str: string) {
            esToolkitSnakeCase(str)
          },
        }
      }).gc("once")
    })
  })
})

await run()
