import puppeteer, { Browser, Page } from 'puppeteer-core';
import { KeplrExtension } from './pages/KeplrExtension';
import { KeplrStake } from './pages/KeplrStake';
import { AppContext } from './context/AppContext';
import { KeplrConfig } from './Keplr/KeplrConfig';
import { AppContextStoreKeys } from './context/AppContextStoreKeys';

async function closeBrowser(browser: Browser) {
    const pages: Page[] = await browser.pages();

    if (pages.length > 1) {
        for (const page of pages) {
            page.close();
        }
    } else {
        browser.close();
    }

}

async function main() {

    const ctx = new AppContext();
    await ctx.loadConfig();

    const keplrConfig = new KeplrConfig(ctx);
    await keplrConfig.loadKeplrExtensionPath();

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${keplrConfig.getKeplrPath()}`,
            `--load-extension=${keplrConfig.getKeplrPath()}`,
        ],
        executablePath: '/usr/bin/chromium',
        userDataDir: ctx.getObject(AppContextStoreKeys.dataDir)
    });

    const page = await browser.newPage();

    const keplrPage = new KeplrExtension(page, keplrConfig.getKeplrExtensionId());

    await keplrPage.startNavigation();

    const keplrStakePage = new KeplrStake(page);

    await keplrStakePage.startNavigation();

    await closeBrowser(browser);

}

main();