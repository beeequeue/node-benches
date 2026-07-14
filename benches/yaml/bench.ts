import * as jsYaml from "js-yaml"
import { barplot, bench, group, run, summary } from "mitata"
import { getFixtures } from "tinyfixturez"
import * as tinyyaml from "tinyyaml"
import * as yaml from "yaml"
import * as yaml3 from "yaml3"

const fixtures = getFixtures(import.meta.dirname)

const files = [
  ["small.yaml", fixtures.readString("small.yaml")],
  ["github-workflow.yaml", fixtures.readString("github-workflow.yaml")],
  ["pnpm-lock.yaml", fixtures.readString("pnpm-lock.yaml")],
  ["kitchen-sink.yaml", fixtures.readString("kitchen-sink.yaml")],
] as const

const parsers = [
  ["js-yaml", (content: string) => jsYaml.load(content)],
  ["tinyyaml", (content: string) => tinyyaml.parse(content)],
  ["yaml@2", (content: string) => yaml.parse(content)],
  ["yaml@3", (content: string) => yaml3.parse(content)],
] as const

barplot(() => {
  summary(() => {
    for (const [fileName, contents] of files) {
      group(fileName, () => {
        for (const [parserName, parse] of parsers) {
          bench(parserName, () => parse(contents)).gc("inner")
        }
      })
    }
  })
})

await run()
