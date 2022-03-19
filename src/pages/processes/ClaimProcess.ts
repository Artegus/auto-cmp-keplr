import { Page } from 'puppeteer-core'
import { Chain } from '../../models/Chain';
import { Processablepage } from '../ProcessablePage';
import { ClaimRewards } from './ClaimReward';
import { DelegateReward } from './DelegateReward';

class ClaimProcess {

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async start(chain: Chain): Promise<boolean> {
        const processes: Processablepage[] = [new ClaimRewards(this.page, chain), new DelegateReward(this.page)]
        
        try {
            for (const prc of processes) {
                await prc.start();
            }
            return true;
        } catch (e) {
            return false;
        }

    }

}


export { ClaimProcess }