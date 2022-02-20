import { Page } from "puppeteer-core";

class KeplrStake {

    private page: Page;
    private url: string = "https://wallet.keplr.app/#/cosmoshub/stake";

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


}

export { KeplrStake }