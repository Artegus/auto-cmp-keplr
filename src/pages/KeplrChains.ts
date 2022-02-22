import { ElementHandle, Page } from "puppeteer-core";
import { Chain } from "../models/Chain";

class KeplrChains {

    private page: Page;

    private chains: Chain[] | undefined;

    private readonly ALL_CHAINS = "ul.navbar-nav:first-child > li.nav-item > div > ul";
    private readonly GROUP_CHAINS = "li > div > ul > li:first-child > a:not(.chain-item)";

    private readonly ALL_CHAINS_LINKS = "ul.navbar-nav:first-child > li.nav-item > div > ul > li > div > ul > li:first-child > a";

    constructor(page: Page) {
        this.page = page;
    }

    public setChains(...chains: Chain[]): void {
        this.chains = chains;
    }

    public getFavoriteChains(): Chain[] {
        if (this.chains) {
            return this.chains.filter(chain => chain.isFavorite());
        }
        return [];
    }

    public getOtherChains(): Chain[] {
        if (this.chains) {
            return this.chains.filter(chain => !chain.isFavorite());
        }
        return [];
    }

    public async startScrape(): Promise<void> {
        await this.getAllChains();
    }

    private async getAllChains(): Promise<void> {

        const chainGroup = await this.page.$$<HTMLUListElement>(this.ALL_CHAINS);

        const favoriteChains = await chainGroup[0].$$<HTMLLinkElement>(this.GROUP_CHAINS);
        const otherChains = await chainGroup[1].$$<HTMLLinkElement>(this.GROUP_CHAINS);

        const favChainsParsed = await this.parseChains(favoriteChains, true);
        const othChainsParsed = await this.parseChains(otherChains, false);

        this.setChains(...favChainsParsed, ...othChainsParsed);
    }

    private async parseChains(nodeElements: ElementHandle<HTMLLinkElement>[], favorite: boolean): Promise<Chain[]> {
        const chains: Chain[] = []; 
        
        for(const nodeElement of nodeElements) {
            const href = await this.page.evaluate((link: HTMLLinkElement) => link.href, nodeElement);
            chains.push(new Chain(href, favorite))
        }

        return chains;
    }

}

export { KeplrChains }