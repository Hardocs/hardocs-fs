module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  },
  collectCoverageFrom: ["**/*.{ts, tsx, js}", "!**/node_modules/**", "!**/dist/**"],
  roots: ["./src"]
};