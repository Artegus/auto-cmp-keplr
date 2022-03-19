import { BrowserEmittedEvents, ElementHandle, Page, Target } from 'puppeteer-core';
import { PageNotFound } from '../exceptions/PageNotFound';
import { TargetCreatedException } from '../exceptions/TargetCreatedException';
import { AbstractPage } from './AbstractPage';

class KeplrPopup extends AbstractPage {

    private static readonly BUTTONS_EXTENSION_POPUP = '.btn-primary';
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

        if(!page) throw new PageNotFound("Page not found");
        await page.waitForSelector(KeplrPopup.BUTTONS_EXTENSION_POPUP);
        return new KeplrPopup(page);
    }

    private async getApproveButton(): Promise<ElementHandle<HTMLButtonElement>> {
        function searchInnerTextButton(): (element: HTMLButtonElement, textToSeach: string) => boolean {
            return (element: HTMLButtonElement, textToSeach: string) => {
                return element.innerText === textToSeach;
            };
        }
        
        return this.querySelectorIncludeText<HTMLButtonElement>({
            selector: KeplrPopup.BUTTONS_EXTENSION_POPUP, 
            text: this.TEXT_APPROVE_BUTTON,
            pageFuntion: searchInnerTextButton
        });
    }

}

export { KeplrPopup }