import { BrowserEmittedEvents, ElementHandle, Page, Target } from 'puppeteer-core';
import { HTMLElementNotFound } from '../errors/HTMLElementNotFound';
import { TargetCreatedException } from '../errors/TargetCreatedException';
import { AbstractPage } from './AbstractPage';

class KeplrPopup extends AbstractPage {

    private readonly BUTTONS_EXTENSION_POPUP = '.btn-primary';
    private readonly TEXT_APPROVE_BUTTON = 'Approve';

    protected constructor(page: Page) {
        super(page);
    }

    public async approveTransaction() {
        const approveButton = await this.getApproveButton();
        await approveButton.click();
    }

    public static async openPopupByClikingButton(buttonElement: ElementHandle<HTMLButtonElement>, currentPage: Page): Promise<KeplrPopup> {
        const [target,] = await Promise.all([
            new Promise<Target | null>(resolve => currentPage.browser().once(BrowserEmittedEvents.TargetCreated, resolve)),
            buttonElement.click(),
        ]);

        if (!target) throw new TargetCreatedException("Target not found"); 

        const page = await target.page();

        if(!page) throw new TargetCreatedException("Page not found");

        return new KeplrPopup(page);
    }

    private async getApproveButton(): Promise<ElementHandle<HTMLButtonElement>> {
        const btns = await this.page.$$<HTMLButtonElement>(this.BUTTONS_EXTENSION_POPUP);
        let button: ElementHandle<HTMLButtonElement> | null = null;

        for (let i = 0; i < btns.length && button == null; i++) {
            const btnValue = await this.page.evaluate((btn: HTMLButtonElement) => btn.textContent, btns[i]);
            if (btnValue) {
                if (btnValue.trim() === this.TEXT_APPROVE_BUTTON) {
                    button = btns[i];
                }
            }
        }
        
        if (button == null) throw new HTMLElementNotFound("Approve Button not found in the extension popup page");

        return button;
    }

}

export { KeplrPopup }