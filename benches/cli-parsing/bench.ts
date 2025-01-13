import { parseArgs, type ParseArgsConfig } from "node:util"

import minimist from "minimist"
import { barplot, bench, group, run, summary } from "mitata"
import mri from "mri"
import { parse as ultraflag } from "ultraflag"
import yargs from "yargs-parser"

import pkgJson from "./package.json" with { type: "json" }

barplot(() => {
  summary(() => {
    group("simple", () => {
      const rawInput =
        "build -h -d dist --format esm --minify --target esnext --metafile".split(" ")

      bench(`node:util ${process.versions.node}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          1(): ParseArgsConfig {
            return {
              allowPositionals: true,
              options: {
                help: { type: "boolean", short: "h" },
                "out-dir": { type: "string", short: "d" },
                format: { type: "string" },
                minify: { type: "boolean" },
                target: { type: "string" },
                metafile: { type: "boolean" }
              },
            }
          },

          bench(input: string[], { allowPositionals, options }: ParseArgsConfig) {
            return parseArgs({ args: input, allowPositionals, options })
          },
        }
      })

      bench(`minimist ${pkgJson.dependencies.minimist}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return minimist(input)
          },
        }
      })

      bench(`mri ${pkgJson.dependencies.mri}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return mri(input)
          },
        }
      })

      bench(`ultraflag ${pkgJson.dependencies.ultraflag}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return ultraflag(input)
          },
        }
      })

      bench(`yargs-parser ${pkgJson.dependencies["yargs-parser"]}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return yargs(input)
          },
        }
      })
    })

    group("with options", () => {
      const rawInput =
        "build -h -d dist --format esm --minify --target esnext --metafile".split(" ")

      bench(`node:util ${process.versions.node}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          1(): ParseArgsConfig {
            return {
              allowPositionals: true,
              options: {
                help: { type: "boolean", short: "h" },
                "out-dir": { type: "string", short: "d" },
                format: { type: "string" },
                minify: { type: "boolean" },
                target: { type: "string" },
                metafile: { type: "boolean" }
              },
            }
          },

          bench(input: string[], { allowPositionals, options }: ParseArgsConfig) {
            return parseArgs({ args: input, allowPositionals, options })
          },
        }
      })

      bench(`minimist ${pkgJson.dependencies.minimist}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return minimist(input, {
              boolean: ["help", "minify", "metafile"],
              string: ["out-dir", "format", "target"],
              alias: { h: "help", d: "out-dir" },
            })
          },
        }
      })

      bench(`mri ${pkgJson.dependencies.mri}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return mri(input, {
              boolean: ["help", "minify", "metafile"],
              string: ["out-dir", "format", "target"],
              alias: { h: "help", d: "out-dir" },
            })
          },
        }
      })

      bench(`ultraflag ${pkgJson.dependencies.ultraflag}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return ultraflag(input, {
              boolean: ["help", "minify", "metafile"],
              string: ["out-dir", "format", "target"],
              alias: { h: "help", d: "out-dir" },
            })
          },
        }
      })

      bench(`yargs-parser ${pkgJson.dependencies["yargs-parser"]}`, function* () {
        yield {
          0(): string[] {
            return rawInput
          },

          bench(input: string[]) {
            return yargs(input, {
              boolean: ["help", "minify", "metafile"],
              string: ["out-dir", "format", "target"],
              alias: { h: "help", d: "out-dir" },
            })
          },
        }
      })
    })
  })
})

await run()
