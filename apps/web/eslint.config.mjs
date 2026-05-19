import { baseConfig } from "@aio-app/eslint-config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  ...baseConfig,

  // ── React & Hooks ──────────────────────────────────────────
  {
    files: ["**/*.tsx"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React 19+: no need to import React
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": "error",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // No default exports in components
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message:
            "Use named exports instead of default exports in components.",
        },
      ],
    },
  },

  // ── Import sort ────────────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Externals (react, react-dom, mantine, etc.)
            ["^react", "^@mantine", "^[a-z]"],
            // 2. Internal aliases (@/...)
            ["^@/"],
            // 3. Relative imports
            ["^\.\./", "^\./"],
            // 4. Type imports
            ["^.*\\u0000$"],
            // 5. CSS / SCSS
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },

  // ── TypeScript rules ───────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-console": "error",
    },
  },

  // ── Ignores ────────────────────────────────────────────────
  {
    ignores: ["node_modules/", "dist/", "coverage/", ".vite/"],
  },
];
