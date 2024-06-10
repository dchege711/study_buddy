/* eslint-env node */

/**
 * ESLint configuration for TypeScript projects.
 *
 * [1]: https://eslint.org/docs/latest/use/configure/configuration-files
 */
module.exports = {
  // Required, else ESLint with try to parse TS code as if it were regulatr JS.
  parser: "@typescript-eslint/parser",

  plugins: [
    // Allows us to use typescript-eslint rules within this codebase.
    "@typescript-eslint",
  ],

  extends: [
    // ESLint's inbuilt recommended config. Small, sensible set of rules that
    // lint for well-known best practices.
    "eslint:recommended",

    // Similar to `eslint:recommended`, but for TypeScript code.
    "plugin:@typescript-eslint/recommended",
  ],

  // ESLint should not search beyond this directory for config files.
  root: true,
};
