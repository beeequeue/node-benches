import { matchesGlob } from "node:path"

import micro from "micromatch"
import { minimatch as mini } from "minimatch"
import { barplot, bench, group, run, summary } from "mitata"
import pico from "picomatch"
import zepto from "zeptomatch"

import pkgJson from "./package.json" with { type: "json" }

const MINIMATCH = `minimatch@${pkgJson.dependencies.minimatch}`
const PICOMATCH = `picomatch@${pkgJson.dependencies.picomatch}`
const MICROMATCH = `micromatch@${pkgJson.dependencies.micromatch}`
const ZEPTOMATCH = `zeptomatch@${pkgJson.dependencies.zeptomatch}`
const NODEPATHMATCH = `node:path@${process.versions.node}`

barplot(() => {
  summary(() => {
    group("match single file with a simple folder structure", () => {
      const path = "src/index.test.ts"
      const glob = "src/**/*.ts"

      bench(MINIMATCH, () => mini(path, glob))

      bench(PICOMATCH, () => pico.isMatch(path, glob))

      bench(MICROMATCH, () => micro.isMatch(path, glob))

      bench(ZEPTOMATCH, () => zepto(glob, path))

      bench(NODEPATHMATCH, () => matchesGlob(path, glob))
    })

    group("match single file with a deep folder structure", () => {
      const path = "src/foo/bar/biz/baz/index.test.ts"
      const glob = "src/**/baz/*.test.ts"

      bench(MINIMATCH, () => mini(path, glob))

      bench(PICOMATCH, () => pico.isMatch(path, glob))

      bench(MICROMATCH, () => micro.isMatch(path, glob))

      bench(ZEPTOMATCH, () => zepto(glob, path))

      bench(NODEPATHMATCH, () => matchesGlob(path, glob))
    })

    group("no match", () => {
      const path = "tests/foo/bar/index.test.ts"
      const glob = "src/**/*.test.ts"

      bench(MINIMATCH, () => mini(path, glob))

      bench(PICOMATCH, () => pico.isMatch(path, glob))

      bench(MICROMATCH, () => micro.isMatch(path, glob))

      bench(ZEPTOMATCH, () => zepto(glob, path))

      bench(NODEPATHMATCH, () => matchesGlob(path, glob))
    })
  })
})

await run()
