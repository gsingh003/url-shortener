import { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"],
    verbose: true,
};

export default config;
