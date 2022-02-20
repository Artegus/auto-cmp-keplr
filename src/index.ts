import puppeteer, { Browser, Page } from 'puppeteer-core';
import { KeplrExtension } from './pages/KeplrExtension';
import { KeplrStake } from './pages/KeplrStake';

import path from 'path';

// fetch data
const userDataDir = "";
const chromeExtensionsDir = "";
const keplrExtensionId = "";
const keplrExtensionVersion = "";

const keplrPath = path.join(chromeExtensionsDir, keplrExtensionId, keplrExtensionVersion);

async function closeBrowser(browser: Browser) {
    const pages: Page[] = await browser.pages();
    
    if (pages.length > 1) {
        for(const page of pages) {
            page.close();
        }
    } else {
        browser.close();
    }

}

async function main() {

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${keplrPath}`,
            `--load-extension=${keplrPath}`,
        ],
        executablePath: '/usr/bin/chromium',
        userDataDir: userDataDir
    });

    const page = await browser.newPage();

    const keplrPage = new KeplrExtension(page, keplrExtensionId);
    
    await keplrPage.startNavigation();

    const keplrStakePage = new KeplrStake(page);

    await keplrStakePage.startNavigation();

    await closeBrowser(browser);

}

main();