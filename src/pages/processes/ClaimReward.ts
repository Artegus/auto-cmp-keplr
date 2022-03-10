import { ElementHandle, Page } from 'puppeteer-core';
import { Chain } from '../../models/Chain';
import { KeplrPopup } from '../KeplrPopup';
import { Processablepage } from '../ProcessablePage';

class ClaimRewards extends Processablepage {

    private chain: Chain;
    private rewardAvailable: boolean = false;

    private readonly DATA_CONTAINER = '.main-content > .container-fluid > .row > .col-lg-12 > .card';
    private readonly REWARD_BUTTON = '.card-header > button';
    private readonly MIN_REWARD = 1e-6;

    constructor(page: Page, chain: Chain) {
        super(page);
        this.chain = chain;
    }

    public async start(): Promise<boolean> {
        await this.goTo();
        await this.retrieveRewardValue();
        if (this.isRewardAvailable()) {
            return this.claimReward();    
        } else {
            return false;
        }
    }

    public setRewardAvailable(rewardAvailable: boolean): void {
        this.rewardAvailable = rewardAvailable;
    }

    public isRewardAvailable(): boolean {
        return this.rewardAvailable;
    }

    private async goTo(): Promise<void> {
        await this.page.goto(this.chain.getUrl(), { waitUntil: 'load' });
    }

    private async getButtonClaimReward(): Promise<ElementHandle<HTMLButtonElement> | null> {
        const dataContainer = await this.page.$<HTMLDivElement>(this.DATA_CONTAINER);
        if (!dataContainer) return null; 
        
        const buttonClaimReward = await dataContainer.$<HTMLButtonElement>(this.REWARD_BUTTON);
        if (!buttonClaimReward) return null;
        
        return buttonClaimReward;
    }

    async retrieveRewardValue() : Promise<void> {
        const rewardButton = await this.getButtonClaimReward();
        if (!rewardButton) return;

        const buttonValue = await this.page.evaluate((btn: HTMLButtonElement) => btn.textContent, rewardButton);
        
        if(buttonValue) {
            this.checkReward(buttonValue);
        }
    }
    
    private checkReward(buttonValue: string): void {
        const valueSplitted = buttonValue.split(' ');
        const rewardAvailable = Number.parseFloat(valueSplitted[2]) > this.MIN_REWARD;
        this.setRewardAvailable(rewardAvailable);
    }
    
    private async claimReward(): Promise<boolean> {
        const rewardButton =  await this.getButtonClaimReward();

        if (!rewardButton) return false;

        try {
            const keplrPopup = await KeplrPopup.openPopupByClikingButton(rewardButton, this.page);
            await keplrPopup.approveTransaction();
            return true;
        } catch (e) {
            return false;
        }
      
    }

}

export { ClaimRewards }