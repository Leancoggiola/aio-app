import { baseConfig } from "./packages/eslint-config/index.mjs";

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
    ignores: [
      "node_modules/",
      "dist/",
      "**/generated/",
      "apps/*/eslint.config.mjs",
      "packages/*/eslint.config.mjs",
    ],
  },
];
