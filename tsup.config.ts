import { execSync } from "node:child_process"
import process from "node:process"

import { defineConfig } from "tsup"

const gitSha = execSync("git rev-parse --short HEAD").toString().trim()

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",

  env: {
    NODE_ENV: process.env.NODE_ENV || "production",
    DEV: (process.env.NODE_ENV === "development") as unknown as string,
    PROD: (process.env.NODE_ENV === "production") as unknown as string,
    TEST: false as unknown as string,
    GIT_SHA: JSON.stringify(gitSha),
  },

  target: "node22",
  format: ["esm"],
  esbuildOptions: (options) => {
    options.supported = {
      // For better performance: https://github.com/evanw/esbuild/issues/951
      "object-rest-spread": false,
    }
  },

  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
})
