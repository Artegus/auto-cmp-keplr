import 'dotenv/config'

type ConfigApp = {
    passwordWallet: string;
    browser: string;
    executablePath: string;
    keplrExtension: {
        id: string;
        version: string;
    }
}

const config: ConfigApp = {
    passwordWallet: process.env.PASS_WALLET || '',
    browser: process.env.BROWSER || '',
    executablePath: process.env.EXECUTABLE_PATH || '',
    keplrExtension: {
        id: process.env.EXTENSION_ID || '',
        version: process.env.EXTENSION_VERSION || ''
    }
}

export { config, ConfigApp }