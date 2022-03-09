import { BrowserEmittedEvents, ElementHandle, Page, Target } from 'puppeteer-core';
import { Chain } from '../../models/Chain';

class ClaimRewards {

    private page: Page;
    private chain: Chain;
    private rewardAvailable: boolean = false;

    private readonly DATA_CONTAINER = '.main-content > .container-fluid > .row > .col-lg-12 > .card';
    private readonly REWARD_BUTTON = '.card-header > button';
    private readonly BUTTONS_EXTENSION_POPUP = '.btn-primary';
    private readonly MIN_REWARD = 1e-6;

    constructor(page: Page, chain: Chain) {
        this.page = page;
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
    
    private async getApproveButton(extensionPopup: Page): Promise<ElementHandle<HTMLButtonElement> | null> {
        const btns = await extensionPopup.$$<HTMLButtonElement>(this.BUTTONS_EXTENSION_POPUP);
        let button: ElementHandle<HTMLButtonElement> | null = null;
        
        for (let i = 0; i < btns.length && button == null; i++) {
            const btnValue = await extensionPopup.evaluate((btn: HTMLButtonElement) => btn.textContent, btns[i]);
            if (btnValue) {
                if (btnValue.trim() === 'Approve') {
                    button = btns[i];
                }
            }
        }
        
        return button;
    }

    private async claimReward(): Promise<boolean> {
        const rewardButton =  await this.getButtonClaimReward();

        if (!rewardButton) return false;

        const [target,] = await Promise.all([
            new Promise<Target | null>(resolve => this.page.browser().once(BrowserEmittedEvents.TargetCreated, resolve)),
            rewardButton.click(),
        ]);

        if (!target) return false; 

        const extensionPopup = await target.page();
        if (!extensionPopup) return false;

        await extensionPopup.waitForTimeout(4000);
        await extensionPopup.bringToFront();
        const btnApprove = await this.getApproveButton(extensionPopup);

        if (btnApprove) {
            await btnApprove.click();
            return true;
        }
        
        return false;
    }

}

export { ClaimRewards }