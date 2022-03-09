import { Page } from 'puppeteer-core'
import { Chain } from '../../models/Chain';
import { ClaimRewards } from './ClaimReward';
import { DelegateReward } from './DelegateReward';

class ClaimProcess {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async start(chain: Chain): Promise<boolean> {
        let statusOk = await this.startFirstStep(chain);
        if (statusOk) {
            statusOk = await this.startSecondStep(chain);
        }
        return statusOk;
    }

    private async startFirstStep(chain: Chain): Promise<boolean> {
        const claimProcess = new ClaimRewards(this.page, chain)
        return claimProcess.start();
    }

    private startSecondStep(chain: Chain) {
        const delegateProcess = new DelegateReward(this.page);
        return delegateProcess.start();
    }

}


export { ClaimProcess }