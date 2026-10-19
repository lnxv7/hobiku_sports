
import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "hobikusports",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-16",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      VINEXT_KV_CACHE: bindings.kv({
        id: "420ea29afc22477db401af73ec0d4255",
      }),
    },
  }),
});
