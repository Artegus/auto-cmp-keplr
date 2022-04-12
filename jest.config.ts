import type { Config } from '@jest/types';
import "dotenv/config"

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        preset: "jest-puppeteer",
        testPathIgnorePatterns: [".dist/"],
    };
};