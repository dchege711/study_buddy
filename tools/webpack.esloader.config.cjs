const path = require("path");

const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = (env, args) => {
  const plugins = [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      onStart() {
        console.log(
          "circular-dependency-plugin: looking for webpack modules cycles...",
        );
      },
    }),
  ];

  const mode = process.env.NODE_ENV || "production";

  return {
    context: args.context,
    mode,
    devtool: mode === "production" ? "hidden-source-map" : "source-map",
    plugins,
    resolve: {
      extensions: [".ts", ".js"],
      extensionAlias: {
        ".js": [".ts", ".js"],
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "esbuild-loader",
            options: {
              format: "esm",
              target: "esnext",
            },
          },
        },
      ],
    },
    output: {
      path: path.resolve(args.context, "dist/"),
      filename: "[name].js",
      publicPath: "/dist/",
      clean: true,
    },
  };
};
