import { baseConfig } from "@repo/eslint-config";

/** @type {import("eslint").Linter.Config} */
export default [
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: [".prettierrc.mjs", "eslint.config.mjs"],
  },
];
