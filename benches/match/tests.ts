import assert from "node:assert"
import { matchesGlob } from "node:path"
import { describe, it } from "node:test"

import micromatch from "micromatch"
import { Minimatch } from "minimatch"
import picomatch from "picomatch"
import zepto from "zeptomatch"

import pkgJson from "./package.json" with { type: "json" }

const MINIMATCH = `minimatch@${pkgJson.dependencies.minimatch}`
const PICOMATCH = `picomatch@${pkgJson.dependencies.picomatch}`
const MICROMATCH = `micromatch@${pkgJson.dependencies.micromatch}`
const ZEPTOMATCH = `zeptomatch@${pkgJson.dependencies.zeptomatch}`
const NODEPATHMATCH = `node:path@${process.versions.node}`
const MEMOIZED_NODEPATHMATCH = `node:path@${process.versions.node} (memoized)`

// memoized version of matchesGlob
const cache = new Map<string, boolean>()
const memoizedMatchesGlob = (path: string, glob: string): boolean => {
  const key = `${path}:${glob}`
  if (cache.has(key)) return cache.get(key)!

  const result = matchesGlob(path, glob)
  cache.set(key, result)
  return result
}

// tests to ensure all libraries are producing the same results

describe("match single file with a simple folder structure", () => {
  const path = "src/index.test.ts"
  const glob = "src/**/*.ts"

  const mini = new Minimatch(glob)
  it(MINIMATCH, () => {
    const result = mini.match(path)
    assert.strictEqual(result, true)
  })

  const pico = picomatch(glob)
  it(PICOMATCH, () => {
    const result = pico(path)
    assert.strictEqual(result, true)
  })

  const micro = micromatch.matcher(glob)
  it(MICROMATCH, () => {
    const result = micro(path)
    assert.strictEqual(result, true)
  })

  it(ZEPTOMATCH, () => {
    const result = zepto(glob, path)
    assert.strictEqual(result, true)
  })

  it(NODEPATHMATCH, () => {
    const result = matchesGlob(path, glob)
    assert.strictEqual(result, true)
  })

  it(MEMOIZED_NODEPATHMATCH, () => {
    const result = memoizedMatchesGlob(path, glob)
    assert.strictEqual(result, true)
  })
})

describe("match single file with a deep folder structure", () => {
  const path = "src/foo/bar/biz/baz/index.test.ts"
  const glob = "src/**/baz/*.test.ts"

  const mini = new Minimatch(glob)
  it(MINIMATCH, () => {
    const result = mini.match(path)
    assert.strictEqual(result, true)
  })

  const pico = picomatch(glob)
  it(PICOMATCH, () => {
    const result = pico(path)
    assert.strictEqual(result, true)
  })

  const micro = micromatch.matcher(glob)
  it(MICROMATCH, () => {
    const result = micro(path)
    assert.strictEqual(result, true)
  })

  it(ZEPTOMATCH, () => {
    const result = zepto(glob, path)
    assert.strictEqual(result, true)
  })

  it(NODEPATHMATCH, () => {
    const result = matchesGlob(path, glob)
    assert.strictEqual(result, true)
  })

  it(MEMOIZED_NODEPATHMATCH, () => {
    const result = memoizedMatchesGlob(path, glob)
    assert.strictEqual(result, true)
  })
})

// describe("array matching multiple globs with a deep folder structure", () => {})

describe("no match", () => {
  const path = "tests/foo/bar/index.test.ts"
  const glob = "src/**/*.test.ts"

  const mini = new Minimatch(glob)
  it(MINIMATCH, () => {
    const result = mini.match(path)
    assert.strictEqual(result, false)
  })

  const pico = picomatch(glob)
  it(PICOMATCH, () => {
    const result = pico(path)
    assert.strictEqual(result, false)
  })

  const micro = micromatch.matcher(glob)
  it(MICROMATCH, () => {
    const result = micro(path)
    assert.strictEqual(result, false)
  })

  it(ZEPTOMATCH, () => {
    const result = zepto(glob, path)
    assert.strictEqual(result, false)
  })

  it(NODEPATHMATCH, () => {
    const result = matchesGlob(path, glob)
    assert.strictEqual(result, false)
  })

  it(MEMOIZED_NODEPATHMATCH, () => {
    const result = memoizedMatchesGlob(path, glob)
    assert.strictEqual(result, false)
  })
})
