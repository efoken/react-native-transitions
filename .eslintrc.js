/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["airbnb", "airbnb/hooks", "plugin:unicorn/recommended", "prettier"],
  rules: {
    "import/prefer-default-export": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "react/react-in-jsx-scope": "off",
    "react/style-prop-object": "off",
    "unicorn/filename-case": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-negated-condition": "off",
    "unicorn/no-null": "off",
    "unicorn/prefer-module": "off",
    "unicorn/prevent-abbreviations": "off",
  },
  overrides: [
    {
      files: ["*.{ts,tsx}"],
      extends: ["airbnb-typescript", "prettier"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
  ignorePatterns: ["packages/*/dist/*"],
};
