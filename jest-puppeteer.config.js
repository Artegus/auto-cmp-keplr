module.exports = {
    launch: {
        dumpio: true,
        headless: process.env.DEV_BROWSER_HEADLESS !== 'false',
        args: [
            `--disable-extensions-except=${process.env.DEV_EXTENSION_PATH}`,
            `--load-extension=${process.env.DEV_EXTENSION_PATH}`,
        ],
        executablePath: process.env.DEV_EXECUTABLE_PATH,
        userDataDir: process.env.DEV_USER_DATA_DIR,
        product: 'chrome',
    },
    browserContext: 'default',
}