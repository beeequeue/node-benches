import { matchesGlob } from "node:path"

import micromatch from "micromatch"
import { Minimatch } from "minimatch"
import { barplot, bench, group, run, summary } from "mitata"
import picomatch from "picomatch"
import zepto from "zeptomatch"

import pkgJson from "./package.json" with { type: "json" }

const MINIMATCH = `minimatch@${pkgJson.dependencies.minimatch}`
const PICOMATCH = `picomatch@${pkgJson.dependencies.picomatch}`
const MICROMATCH = `micromatch@${pkgJson.dependencies.micromatch}`
const ZEPTOMATCH = `zeptomatch@${pkgJson.dependencies.zeptomatch}`
const NODEPATHMATCH = `node:path@${process.versions.node}`
const MEMOIZED_NODEPATHMATCH = `node:path@${process.versions.node} (memoized)`

const createMemoizedMatchesGlob = () => {
  const cache = new Map<string, boolean>()
  const memoizedMatchesGlob = (path: string, glob: string): boolean => {
    const key = `${path}:${glob}`
    if (cache.has(key)) return cache.get(key)!

    const result = matchesGlob(path, glob)
    cache.set(key, result)
    return result
  }

  return memoizedMatchesGlob
}

barplot(() => {
  summary(() => {
    group("match single file with a simple folder structure", () => {
      const path = "src/index.test.ts"
      const glob = "src/**/*.ts"

      const mini = new Minimatch(glob)
      bench(MINIMATCH, () => mini.match(path))

      const pico = picomatch(glob)
      bench(PICOMATCH, () => pico(path))

      const micro = micromatch.matcher(glob)
      bench(MICROMATCH, () => micro(path))

      bench(ZEPTOMATCH, () => zepto(glob, path))

      bench(NODEPATHMATCH, () => matchesGlob(path, glob))

      const memoizedMatchesGlob = createMemoizedMatchesGlob()
      bench(MEMOIZED_NODEPATHMATCH, () => memoizedMatchesGlob(path, glob))
    })

    group("match single file with a deep folder structure", () => {
      const path = "src/foo/bar/biz/baz/index.test.ts"
      const glob = "src/**/baz/*.test.ts"

      const mini = new Minimatch(glob)
      bench(MINIMATCH, () => mini.match(path))

      const pico = picomatch(glob)
      bench(PICOMATCH, () => pico(path))

      const micro = micromatch.matcher(glob)
      bench(MICROMATCH, () => micro(path))

      bench(ZEPTOMATCH, () => zepto(glob, path))

      bench(NODEPATHMATCH, () => matchesGlob(path, glob))

      const memoizedMatchesGlob = createMemoizedMatchesGlob()
      bench(MEMOIZED_NODEPATHMATCH, () => memoizedMatchesGlob(path, glob))
    })

    group("no match", () => {
      const path = "tests/foo/bar/index.test.ts"
      const glob = "src/**/*.test.ts"

      const mini = new Minimatch(glob)
      bench(MINIMATCH, () => mini.match(path))

      const pico = picomatch(glob)
      bench(PICOMATCH, () => pico(path))

      const micro = micromatch.matcher(glob)
      bench(MICROMATCH, () => micro(path))

      bench(ZEPTOMATCH, () => zepto(glob, path))

      bench(NODEPATHMATCH, () => matchesGlob(path, glob))

      const memoizedMatchesGlob = createMemoizedMatchesGlob()
      bench(MEMOIZED_NODEPATHMATCH, () => memoizedMatchesGlob(path, glob))
    })
  })
})

await run()
