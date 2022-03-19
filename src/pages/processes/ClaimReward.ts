import { ElementHandle, Page } from 'puppeteer-core';
import { RewardsAreNotAvailable } from '../../exceptions/RewardsAreNotAvailable';
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

    public async start(): Promise<void> {
        await this.goTo();
        await this.retrieveRewardValue();
        if (this.isRewardAvailable()) {
            await this.claimReward();    
        } else {
            throw new RewardsAreNotAvailable(`Rewards are less than ${this.MIN_REWARD}`);
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

    private async getButtonClaimReward(): Promise<ElementHandle<HTMLButtonElement>> {
        const dataContainer = await this.pageQuerySelector<HTMLDivElement>(this.DATA_CONTAINER)
        return this.elementQuerySelector<HTMLButtonElement>(dataContainer, this.REWARD_BUTTON);
    }

    async retrieveRewardValue() : Promise<void> {
        const rewardButton = await this.getButtonClaimReward();

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
    
    private async claimReward(): Promise<void> {
        const rewardButton =  await this.getButtonClaimReward();
        const keplrPopup = await KeplrPopup.openPopupByClikingButton(rewardButton, this.page);
        await keplrPopup.approveTransaction(); 
        await this.page.waitForNetworkIdle(); //FIXME: Wait for update balance
    }

}

export { ClaimRewards }