import fs from "node:fs"
import path from "node:path"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import zlib from "node:zlib"

import * as Fflate from "fflate"
import { barplot, bench, group, run, summary } from "mitata"
import { unpackTar } from "modern-tar/fs"
import { getFixtures } from "tinyfixturez"
import * as Yazl from "yazl"
import { ZipWriter } from "zip-writer"

import pkgJson from "./package.json" with { type: "json" }

// const ZIPJS = `@zip.js/zip.js@${pkgJson.dependencies["@zip.js/zip.js"]}`
// const ARCHIVER = `archiver@${pkgJson.dependencies.archiver}`
const FFLATE = `fflate@${pkgJson.dependencies.fflate}`
// const YAUZL = `yauzl@${pkgJson.dependencies.yauzl}`
const YAZL = `yazl@${pkgJson.dependencies.yazl}`
const ZIP_WRITER = `zip-writer@${pkgJson.dependencies["zip-writer"]}`

const fixtures = getFixtures(import.meta.dirname)
const outDir = fixtures.temp()
const dirToZip = fixtures.temp()

const vueFileName = "vue-3.5.34.tgz"
const vueFileNameZip = "vue-3.5.34.zip"
const vueTar = fixtures.readRaw(vueFileName)
await pipeline(Readable.from(vueTar), zlib.createGunzip(), unpackTar(dirToZip))
const filesToZip = fs
  .globSync("**/*.*", { cwd: dirToZip })
  .map((filePath) => filePath.replace(/\\/g, "/"))

barplot(() => {
  summary(() => {
    group(`zipping ${vueFileName} uncompressed`, () => {
      bench(FFLATE, async () => {
        const outputStream = new Readable({ read() {} })

        const zip = new Fflate.Zip((err, dat, final) => {
          if (err) throw err

          outputStream.push(dat)
          if (final) {
            outputStream.push(null)
          }
        })

        for (const filePath of filesToZip) {
          const file = new Fflate.ZipPassThrough(filePath)
          zip.add(file)
          const stream = fs.createReadStream(path.join(dirToZip, filePath))
          stream.on("data", (chunk) => {
            file.push(Buffer.from(chunk))
          })
          stream.on("close", () => {
            file.push(Buffer.alloc(0), true)
          })
        }
        zip.end()

        const outFile = path.join(outDir, vueFileNameZip)
        await pipeline(outputStream, fs.createWriteStream(outFile))
      }).gc("inner")

      bench(YAZL, async () => {
        const zipfile = new Yazl.ZipFile()
        for (const filePath of filesToZip) {
          zipfile.addReadStreamLazy(filePath, { compress: false }, (cb) =>
            cb(null, fs.createReadStream(path.join(dirToZip, filePath))),
          )
        }
        zipfile.end()

        const outFile = path.join(outDir, YAZL, vueFileNameZip)
        fs.mkdirSync(path.dirname(outFile), { recursive: true })
        await pipeline(zipfile.outputStream, fs.createWriteStream(outFile))
      }).gc("inner")

      bench(ZIP_WRITER, async () => {
        const zipwriter = new ZipWriter()
        const outFile = path.join(outDir, ZIP_WRITER, vueFileNameZip)
        fs.mkdirSync(path.dirname(outFile), { recursive: true })
        const writePromise = pipeline(zipwriter.readable, fs.createWriteStream(outFile))

        for (const filePath of filesToZip) {
          // oxlint-disable-next-line no-await-in-loop
          await zipwriter.addEntry({
            name: filePath,
            store: true,
            readable: ReadableStream.from(fs.createReadStream(path.join(dirToZip, filePath))),
          })
        }

        await zipwriter.finalize()
        await writePromise
      }).gc("inner")
    })

    group(`zipping ${vueFileName} compressionLevel 9`, () => {
      bench(FFLATE, async () => {
        const outputStream = new Readable({ read() {} })

        const zip = new Fflate.Zip((err, dat, final) => {
          if (err) throw err

          outputStream.push(dat)
          if (final) {
            outputStream.push(null)
          }
        })

        for (const filePath of filesToZip) {
          const file = new Fflate.ZipDeflate(filePath, { level: 9 })
          zip.add(file)
          const stream = fs.createReadStream(path.join(dirToZip, filePath))
          stream.on("data", (chunk) => {
            file.push(Buffer.from(chunk))
          })
          stream.on("close", () => {
            file.push(Buffer.alloc(0), true)
          })
        }
        zip.end()

        const outFile = path.join(outDir, vueFileNameZip)
        await pipeline(outputStream, fs.createWriteStream(outFile))
      }).gc("inner")

      bench(YAZL, async () => {
        const zipfile = new Yazl.ZipFile()
        for (const filePath of filesToZip) {
          zipfile.addReadStreamLazy(filePath, { compressionLevel: 9 }, (cb) =>
            cb(null, fs.createReadStream(path.join(dirToZip, filePath))),
          )
        }
        zipfile.end()

        const outFile = path.join(outDir, YAZL, vueFileNameZip)
        fs.mkdirSync(path.dirname(outFile), { recursive: true })
        await pipeline(zipfile.outputStream, fs.createWriteStream(outFile))
      }).gc("inner")

      bench(ZIP_WRITER, async () => {
        const zipwriter = new ZipWriter()
        const outFile = path.join(outDir, ZIP_WRITER, vueFileNameZip)
        fs.mkdirSync(path.dirname(outFile), { recursive: true })
        const writePromise = pipeline(zipwriter.readable, fs.createWriteStream(outFile))

        for (const filePath of filesToZip) {
          // oxlint-disable-next-line no-await-in-loop
          await zipwriter.addEntry({
            name: filePath,
            store: false,
            readable: ReadableStream.from(fs.createReadStream(path.join(dirToZip, filePath))),
          })
        }

        await zipwriter.finalize()
        await writePromise
      }).gc("inner")
    })
  })
})

await run()
