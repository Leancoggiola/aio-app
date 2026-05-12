import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "api",
        "web",
        "shared",
        "eslint-config",
        "ts-config",
        "deps",
        "release",
        "ci",
      ],
    ],
    "scope-empty": [1, "never"],
    "subject-case": [2, "always", "lower-case"],
  },
};

export default config;
