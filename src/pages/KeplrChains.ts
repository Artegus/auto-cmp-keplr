import { ElementHandle, Page } from "puppeteer-core";
import { Chain } from "../models/Chain";

class KeplrChains {

    private page: Page;
    private url: string = "https://wallet.keplr.app/#/";

    private chains: Chain[] | undefined;
    private favoriteChains: Chain[] | undefined;
    private otherChains: Chain[] | undefined;

    private readonly ALL_CHAINS = "ul.navbar-nav:first-child > li.nav-item > div > ul";
    private readonly STAKE_SECTION = "div > ul > li:first-child > a";

    constructor(page: Page) {
        this.page = page;
    }

    public async startNavigation() {
        await this.goTo();

    }

    private async goTo(): Promise<void> {
        await this.page.goto(this.url);
        await this.page.waitForNavigation({
            waitUntil: 'networkidle0'
        })
    }

    async getAllChains(): Promise<void> {

        const chains: ElementHandle<HTMLUListElement>[] = await this.page.$$<HTMLUListElement>(this.ALL_CHAINS);

        const favoriteChains = await chains[0].evaluate(() =>
            Array.from(document.querySelectorAll('li')).map(e => {
                const stakeSection = e.querySelectorAll<HTMLLinkElement>(this.STAKE_SECTION)[0];
                return stakeSection.href;
            })
        );

        const otherChains = await chains[1].evaluate(() =>
            Array.from(document.querySelectorAll('li')).map(e => {
                const stakeSection = e.querySelectorAll<HTMLLinkElement>(this.STAKE_SECTION)[0];
                return stakeSection.href;
            })
        );

        console.log(favoriteChains);

    }


}

export { KeplrChains }