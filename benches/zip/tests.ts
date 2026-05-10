import fs from "node:fs"
import path from "node:path"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import { describe, it } from "node:test"
import zlib from "node:zlib"

import * as Fflate from "fflate"
import { unpackTar } from "modern-tar/fs"
import { exec } from "tinyexec"
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
// const MODERN_ZIP = `modern-zip@${pkgJson.dependencies["modern-zip"]}`

const fixtures = getFixtures(import.meta.dirname)

const getZipFileStructure = async (zipFilePath: string): Promise<string> => {
  const result = await exec("unzip", ["-l", zipFilePath])
  return result.stdout
    .replace(/[\r\n]+/g, "\n")
    .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g, "2026-01-30 13:37")
    .split("\n")
    .slice(1)
    .join("\n")
}

const matchesUncompressedVueZip = async (t: it.TestContext, outFile: string) => {
  t.assert.fileSnapshot(await getZipFileStructure(outFile), "snapshots/uncompressed-vue.snapshot", {
    serializers: [(s) => s],
  })
}

const vueFileName = "vue-3.5.34.tgz"
const vueFileNameZip = "vue-3.5.34.zip"
describe(`zipping ${vueFileName}`, async () => {
  const outDir = fixtures.temp()
  const vueTar = fixtures.readRaw(vueFileName)
  const dirToZip = fixtures.temp()
  await pipeline(Readable.from(vueTar), zlib.createGunzip(), unpackTar(dirToZip))
  const filesToZip = fs
    .globSync("**/*.*", { cwd: dirToZip })
    .map((filePath) => filePath.replace(/\\/g, "/"))

  describe("without compression", () => {
    it(FFLATE, { timeout: 250 }, async (t) => {
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

      const outFile = path.join(outDir, FFLATE, vueFileNameZip)
      fs.mkdirSync(path.dirname(outFile), { recursive: true })
      await pipeline(outputStream, fs.createWriteStream(outFile))

      await matchesUncompressedVueZip(t, outFile)
    })

    it(YAZL, async (t) => {
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

      await matchesUncompressedVueZip(t, outFile)
    })

    it(ZIP_WRITER, async (t) => {
      const zipwriter = new ZipWriter()
      const outFile = path.join(outDir, ZIP_WRITER, vueFileNameZip)
      fs.mkdirSync(path.dirname(outFile), { recursive: true })
      const writePromise = pipeline(zipwriter.readable, fs.createWriteStream(outFile))

      for (const filePath of filesToZip) {
        zipwriter.addEntry({
          name: filePath,
          readable: ReadableStream.from(fs.createReadStream(path.join(dirToZip, filePath))),
        })
      }

      await zipwriter.finalize()
      await writePromise

      await matchesUncompressedVueZip(t, outFile)
    })
  })

  // describe.todo("with compression 9", () => {
  //   it(YAZL, async () => {
  //     const zipfile = new Yazl.ZipFile()
  //     for (const filePath of filesToZip) {
  //       zipfile.addReadStreamLazy(filePath, { compressionLevel: 9 }, (cb) =>
  //         cb(null, fs.createReadStream(path.join(dirToZip, filePath))),
  //       )
  //     }
  //     zipfile.end()
  //
  //     const outFile = path.join(outDir, YAZL, vueFileNameZip)
  //     fs.mkdirSync(path.dirname(outFile), { recursive: true })
  //     const writePromise = pipeline(zipfile.outputStream, fs.createWriteStream(outFile))
  //     await writePromise
  //
  //     // await matchesUncompressedVueZip(t, outFile)
  //   })
  // })
})
