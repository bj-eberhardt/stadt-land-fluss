import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "prettier.config.cjs",
      "tsconfig.tsbuildinfo",
      ".idea/**",
    ],
  },

  js.configs.recommended,

  // TypeScript rules (no type-aware linting by default; can be enabled later)
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh.plugin,
    },
    rules: {
      // Hooks
      ...reactHooks.configs.recommended.rules,

      // Vite Fast Refresh
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },

  // Disable rules that conflict with Prettier
  prettier,
);
