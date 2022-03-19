import { AppContext } from "../context/AppContext";
import { AppContextStoreKeys } from "../context/AppContextStoreKeys";
import { KeplrChains } from "./KeplrChains";
import { NavigablePage } from "./NavigablePage";
import { Processablepage } from "./ProcessablePage";

class KeplrStake extends NavigablePage implements Processablepage {
    
    private readonly URL_STAKE_PAGE: string = "https://wallet.keplr.app/#/";
    
    async start(): Promise<void> {
        await this.startNavigation();
        const isDefaultChainsSetted = AppContext.getInstance().getBooleanValue(AppContextStoreKeys.isDefaultChainsSetted);
        if (!isDefaultChainsSetted) {
            await this.retrieveChains();
        }
    }

    public async startNavigation() {
        await this.goTo();
    }

    private async goTo(): Promise<void> {
        await this.page.goto(this.URL_STAKE_PAGE, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(4000);
    }

    private async retrieveChains(): Promise<void> {
        const keplrChains = new KeplrChains(this.page);
        await keplrChains.startNavigation();
        const allChains = keplrChains.getChains("all");
        AppContext.getInstance().setObject(AppContextStoreKeys.allChains, allChains);
    }

}

export { KeplrStake }