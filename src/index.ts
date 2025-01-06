import { bench, boxplot, run, summary } from "mitata"

boxplot(() => {
  summary(() => {
    bench("")
  })
})

await run()
