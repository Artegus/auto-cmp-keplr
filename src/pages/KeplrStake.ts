import { Page } from "puppeteer-core";
import { Chain } from "../models/Chain";
import { KeplrChains } from "./KeplrChains";

class KeplrStake {

    private page: Page;
    private url: string = "https://wallet.keplr.app/#/";

    constructor(page: Page) {
        this.page = page;
    }

    public async startNavigation() {
        await this.goTo();
    }

    private async goTo(): Promise<void> {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(4000);
    }

    public async retrieveChains(): Promise<Chain[]> {
        const keplrChains = new KeplrChains(this.page);
        await keplrChains.startScrape();
        return keplrChains.getChains();
    }

}

export { KeplrStake }