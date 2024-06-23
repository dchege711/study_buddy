import { esbuildPlugin } from "@web/dev-server-esbuild";
import { fileURLToPath, URL } from "url";

/**
 * The port on which the development server runs. This is the port that is set
 * in the `web-test-runner`'s configuration.
 */
const devServerPort = 4999;

/**
 * The port on which the application server runs. This is the port that is set
 * in the application's configuration.
 */
const appServerPort = 5000;

/**
 * Middle-ware for rewriting the `devServerPort` to `appServerPort` so that
 * requests are proxied to the application server.
 */
function rewritePort(context, next) {
  if (context.url.startsWith(`/trpc/searchPublicCards`)) {
    context.url = `http://localhost:${appServerPort}${context.url}`;
  }

  return next();
}

/**
 * See [1] for options. Camel-case them before using them.
 *
 * [1]: https://modern-web.dev/docs/test-runner/cli-and-configuration/#cli-flags
 */
export default {
  /** Test files glob patterns. */
  files: [
    // "./src/**/*.test.ts"
    "./src/components/search-bar/search-bar.test.ts",
  ],

  // Middleware used by the server to modify requests/responses.
  middleware: [
    rewritePort
  ],

  /**
   * Unlike in Node, the browser does not have access to the file system. Bare
   * module imports or imports without file extensions need to be resolved
   * server-side. This option enables that.
   *
   * [1]: https://modern-web.dev/guides/going-buildless/es-modules/#import-paths
   */
  nodeResolve: true,

  /** Port to bind the server on. */
  port: devServerPort,

  /**
   * In a monorepo you need to set the root dir to resolve modules.
   */
  rootDir: '../../',

  /** Plugins used by the server to serve or transform files. */
  plugins: [
    esbuildPlugin({
      target: "auto",
      ts: true,
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    })
  ],
};
