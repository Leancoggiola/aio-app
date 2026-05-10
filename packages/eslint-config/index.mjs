import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export const baseConfig = [
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];
