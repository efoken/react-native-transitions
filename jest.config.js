/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?)/)",
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"].flatMap((extension) => [
    `web.${extension}`,
    extension,
  ]),
  modulePathIgnorePatterns: ["<rootDir>/examples"],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
  },
};
