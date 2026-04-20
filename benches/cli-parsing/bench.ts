import { parseArgs, type ParseArgsConfig } from "node:util"

import minimist from "minimist"
import { barplot, bench, run, summary } from "mitata"
import mri from "mri"
import { parse as ultraflag, type ParseOptions } from "ultraflag"
import yargs from "yargs-parser"

import pkgJson from "./package.json" with { type: "json" }

barplot(() => {
  summary(() => {
    const args =
      "build -h -d dist --format esm --minify --target esnext --metafile".split(" ")

    bench(`node:util@${process.versions.node} (no options)`, function* () {
      yield {
        0(): string[] {
          return args
        },

        bench(input: string[]) {
          return parseArgs({ args: input, strict: false })
        },
      }
    })

    bench(`node:util@${process.versions.node}`, function* () {
      yield {
        0(): string[] {
          return args
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
              metafile: { type: "boolean" },
            },
          }
        },

        bench(input: string[], { allowPositionals, options }: ParseArgsConfig) {
          return parseArgs({ args: input, allowPositionals, options })
        },
      }
    })

    bench(`minimist@${pkgJson.dependencies.minimist} (no options)`, function* () {
      yield {
        0(): string[] {
          return args
        },

        bench(input: string[]) {
          return minimist(input)
        },
      }
    })

    bench(`minimist@${pkgJson.dependencies.minimist}`, function* () {
      yield {
        0(): string[] {
          return args
        },

        1(): minimist.Opts {
          return {
            boolean: ["help", "minify", "metafile"],
            string: ["out-dir", "format", "target"],
            alias: { h: "help", d: "out-dir" },
          }
        },

        bench(input: string[], options: minimist.Opts) {
          return minimist(input, options)
        },
      }
    })

    bench(`mri@${pkgJson.dependencies.mri} (no options)`, function* () {
      yield {
        0(): string[] {
          return args
        },

        bench(input: string[]) {
          return mri(input)
        },
      }
    })

    bench(`mri@${pkgJson.dependencies.mri}`, function* () {
      yield {
        0(): string[] {
          return args
        },

        1(): mri.Options {
          return {
            boolean: ["help", "minify", "metafile"],
            string: ["out-dir", "format", "target"],
            alias: { h: "help", d: "out-dir" },
          }
        },

        bench(input: string[], options: mri.Options) {
          return mri(input, options)
        },
      }
    })

    bench(`ultraflag@${pkgJson.dependencies.ultraflag} (no options)`, function* () {
      yield {
        0(): string[] {
          return args
        },

        bench(input: string[]) {
          return ultraflag(input)
        },
      }
    })

    bench(`ultraflag@${pkgJson.dependencies.ultraflag}`, function* () {
      yield {
        0(): string[] {
          return args
        },

        1(): ParseOptions {
          return {
            boolean: ["help", "minify", "metafile"],
            string: ["out-dir", "format", "target"],
            alias: { h: "help", d: "out-dir" },
          }
        },

        bench(input: string[], options: ParseOptions) {
          return ultraflag(input, options)
        },
      }
    })

    bench(`yargs-parser@${pkgJson.dependencies["yargs-parser"]} (no options)`, function* () {
      yield {
        0(): string[] {
          return args
        },

        bench(input: string[]) {
          return yargs(input)
        },
      }
    })

    bench(`yargs-parser@${pkgJson.dependencies["yargs-parser"]}`, function* () {
      yield {
        0(): string[] {
          return args
        },

        1(): yargs.Options {
          return {
            boolean: ["help", "minify", "metafile"],
            string: ["out-dir", "format", "target"],
            alias: {
              h: "help",
              d: "out-dir",
            },
          }
        },

        bench(input: string[], options: yargs.Options) {
          return yargs(input, options)
        },
      }
    })
  })
})

await run()
