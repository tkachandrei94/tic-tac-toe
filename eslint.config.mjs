import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
];
