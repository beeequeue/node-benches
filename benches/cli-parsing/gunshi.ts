import { cli, define } from "gunshi"

const command = define({
  name: "build",
  args: {
    minify: { type: "boolean" },
    metafile: { type: "boolean" },
    outDir: { type: "string", short: "d" },
    format: { type: "string" },
    target: { type: "string" },
  },
})

const args = "build -d dist --format esm --minify --target esnext --metafile".split(" ")
console.log(args)
console.log(process.argv.slice(2))
await cli(process.argv.slice(2) ?? args, command)
