module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "jest.tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/test/**/*.test.(ts|js)"
  ],
  testEnvironment: "node",
  setupFilesAfterEnv: ["jest-extended"]
};
