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
        try {
            await claimProcess.start();
            return true;
        } catch (error) {
            return false;
        }
    }

    private async startSecondStep(chain: Chain) {
        const delegateProcess = new DelegateReward(this.page);
        try {
            await delegateProcess.start();
            return true;
        } catch (error) {
            return false;
        }
    }

}


export { ClaimProcess }