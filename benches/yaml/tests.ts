import fs from "node:fs"
import path from "node:path"
// import assert from "node:assert"
import { describe, it } from "node:test"

import * as jsYaml from "js-yaml"
import { getFixtures } from "tinyfixturez"
import * as tinyyaml from "tinyyaml"
import * as yaml from "yaml"
import * as yaml3 from "yaml3"

const fixtures = getFixtures(import.meta.dirname)

const getSnapshotPath = (name: string) => {
  const filePath = path.join(import.meta.dirname, "snapshots", name.split(".")[0] + ".json")
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, "")
  }
  return filePath
}

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

for (const [fileName, contents] of files) {
  describe(fileName, () => {
    for (const [name, parse] of parsers) {
      it(name, (t) => {
        t.assert.fileSnapshot(parse(contents), getSnapshotPath(fileName))
      })
    }
  })
}
