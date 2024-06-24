import { esbuildPlugin } from "@web/dev-server-esbuild";
import { importMapsPlugin } from "@web/dev-server-import-maps";
import { fileURLToPath, URL } from "url";

/**
 * See [1] for options. Camel-case them before using them.
 *
 * [1]: https://modern-web.dev/docs/test-runner/cli-and-configuration/#cli-flags
 */
export default {
  /** Test files glob patterns. */
  files: [
    "./src/**/*.test.ts",
  ],

  /**
   * Unlike in Node, the browser does not have access to the file system. Bare
   * module imports or imports without file extensions need to be resolved
   * server-side. This option enables that.
   *
   * [1]: https://modern-web.dev/guides/going-buildless/es-modules/#import-paths
   */
  nodeResolve: true,

  /**
   * In a monorepo you need to set the root dir to resolve modules.
   */
  rootDir: "../../",

  /** Plugins used by the server to serve or transform files. */
  plugins: [
    esbuildPlugin({
      target: "auto",
      ts: true,
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
    }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            "/src/public/src/trpc.ts?wds-import-map=0":
              "/src/public/mocks/trpc.ts",
          },
        },
      },
    }),
  ],
};
