import { Page } from 'puppeteer-core';
import { config } from '../config';
import { NavigablePage } from './NavigablePage';

class KeplrExtension extends NavigablePage {
    
    private keplrExtensionId: string;
    private url: string;

    private readonly PASSWORD_INPUT = 'input[name="password"]';
    private readonly UNLOCK_BUTTON = 'button[type="submit"]';

    constructor(page: Page, keplrExtensionId: string) {
        super(page);
        this.keplrExtensionId = keplrExtensionId;
        this.url = this.configPath();
    }
    
    public async startNavigation(): Promise<void> {
        await this.page.goto(this.url);
        await this.connectToWallet();
    }
    
    private configPath(): string {
        return `chrome-extension://${this.keplrExtensionId}/popup.html#/`;
    }

    private async connectToWallet(): Promise<void> {
        await this.setPassword();
        await this.unlockWallet();
    }

    private async setPassword(): Promise<void> {
        await this.page.waitForSelector(this.PASSWORD_INPUT);
        await this.page.focus(this.PASSWORD_INPUT);
        await this.page.type(this.PASSWORD_INPUT, config.passwordWallet, { delay: 200 });
    }

    private async unlockWallet(): Promise<void> {
        await this.page.waitForSelector(this.UNLOCK_BUTTON);
        await this.page.click(this.UNLOCK_BUTTON)
        await this.page.waitForNavigation({
            waitUntil: 'networkidle0'
        })
        await this.page.waitForSelector('.popper');
        await this.page.waitForTimeout(2000);
    }

}

export { KeplrExtension }