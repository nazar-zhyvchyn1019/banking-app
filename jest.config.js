module.exports = {
    clearMocks: true,
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/src/libs/singleton.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", // Map @/ to the src folder
    },
};
