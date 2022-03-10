import { Chain } from "../models/Chain";
import { KeplrChains } from "./KeplrChains";
import { NavigablePage } from "./NavigablePage";

class KeplrStake extends NavigablePage {

    private readonly URL_STAKE_PAGE: string = "https://wallet.keplr.app/#/";

    public async startNavigation() {
        await this.goTo();
    }

    private async goTo(): Promise<void> {
        await this.page.goto(this.URL_STAKE_PAGE, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(4000);
    }

    public async retrieveChains(): Promise<Chain[]> {
        const keplrChains = new KeplrChains(this.page);
        await keplrChains.startNavigation();
        return keplrChains.getChains("all");
    }

}

export { KeplrStake }