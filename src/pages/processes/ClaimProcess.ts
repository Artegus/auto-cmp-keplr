import { Page } from 'puppeteer-core'
import { Chain } from '../../models/Chain';
import { ClaimRewards } from './ClaimReward';

class ClaimProcess {

    private page: Page;
    private chain?: Chain;

    constructor(page: Page) {
        this.page = page;
    }
    
    public setChain(chain: Chain) {
        this.chain = chain;
    }

    public async start(): Promise<void> {
        if (this.chain) {
            const statusOk = await this.startFirstStep();
            if (statusOk) {
                this.startSecondStep();
            }
        }
    }

    private async startFirstStep(): Promise<boolean>  {
        const claimProcess = new ClaimRewards(this.page, this.chain!)
        return claimProcess.start();
    }

    private startSecondStep() {

    }

}


export { ClaimProcess }