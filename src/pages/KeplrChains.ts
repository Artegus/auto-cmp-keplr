import { ElementHandle } from "puppeteer-core";
import { Chain } from "../models/Chain";
import { NavigablePage } from "./NavigablePage";

type ChainType = "favorites" | "others" | "all";

class KeplrChains extends NavigablePage {

    private chains: Chain[] = [];

    private readonly ALL_CHAINS = "ul.navbar-nav:first-child > li.nav-item > div > ul";
    private readonly GROUP_CHAINS = "li > div > ul > li:first-child > a:not(.chain-item)";

    public async startNavigation(): Promise<void> {
        await this.getAllChains();
    }

    public setChains(...chains: Chain[]): void {
        this.chains = chains;
    }

    public getChains(type: ChainType): Chain[] {
        switch(type) {
            case "all": return this.chains;
            case "favorites": return this.chains.filter(chain => chain.isFavorite());
            case "others": return this.chains.filter(chain => !chain.isFavorite());
        }
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