/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["airbnb", "airbnb/hooks", "plugin:unicorn/recommended", "prettier"],
  rules: {
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "react/function-component-definition": "off",
    "react/jsx-props-no-spreading": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/static-property-placement": "off",
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
      extends: [
        "airbnb-typescript",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "prettier",
      ],
      parserOptions: {
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/lines-between-class-members": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "import/extensions": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
  ignorePatterns: ["packages/*/dist/*"],
};
