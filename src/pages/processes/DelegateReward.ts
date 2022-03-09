import { ElementHandle, Page } from 'puppeteer-core';
import { IValidator, Validator } from '../../models/Validator';
import { KeplrPopup } from '../KeplrPopup';

class DelegateReward {

    private page: Page;
    private validators: Validator[] = [];

    private readonly DATA_CONTAINER = '.main-content > .container-fluid > .row > .col-lg-12 > .card';
    private readonly TABLE_ROW_ELEMENTS = '.card-body > table > .list tr';
    private readonly MODAL_CONTENT = '.modal-content > div > div';
    private readonly DELEGATE_BUTTON = 'button.btn.btn-primary';

    constructor(page: Page) {
        this.page = page;
    }

    public async start(): Promise<boolean> {
        let statusOk = false;
        await this.retrieveValidators();
        const validator = this.selectValidorWithLowestAmountStaked();
        statusOk = await this.delegate(validator);

        return statusOk;
    }

    private async retrieveValidators(): Promise<void> {
        const validators = await this.getValidatorsHTMLRowElement();
        if (!validators) return; 
        
        for (const validator of validators) {
            const validatorData: IValidator = await this.page.evaluate((tableRowEl: HTMLTableRowElement) => {
                const [name, amountStaked, pendingReward,] = tableRowEl.cells;
                const processValue = (value: string) => Number.parseFloat(value.split(' ')[0])  
                return {
                    name: name.innerText,
                    amountStaked: processValue(amountStaked.innerText),
                    pendingReward: processValue(pendingReward.innerText)
                };
            }, validator);

            this.validators.push(new Validator(validatorData));
        }
    }

    private selectValidorWithLowestAmountStaked(): Validator {
        this.orderValidatorsAsc();
        return this.validators[0];
    }

    private async delegate(validator: Validator): Promise<boolean> {
        await this.clickOnManageValidator(validator.getName());
        await this.clickOnDelegate();
        await this.clickOnMaxAmountToDelegate();
        const statusOk = await this.clickOnDelegateAndManagePopup();
        
        return statusOk;
    }

    async getModalContent(): Promise<ElementHandle<HTMLDivElement> | null> {
        await this.page.waitForSelector(this.MODAL_CONTENT);
        return this.page.$<HTMLDivElement>(this.MODAL_CONTENT);
    }

    async clickOnManageValidator(validatorName: string) {
        const validatorHTMLRowElement = await this.getValidatorHTMLRowElement(validatorName);
        if (!validatorHTMLRowElement) return;
        
        const manageButton = await validatorHTMLRowElement.$<HTMLButtonElement>('button');
        if (!manageButton) return;

        await manageButton.click();
        await this.page.waitForTimeout(1000);
    }

    private async clickOnDelegate() {
        const modalContent = await this.getModalContent();
        if (!modalContent) return;
        
        const delegateButton = await modalContent.$<HTMLButtonElement>(this.DELEGATE_BUTTON);
        if (!delegateButton) return;

        await delegateButton.click();
        await this.page.waitForTimeout(1000);
    }

    private async clickOnDelegateAndManagePopup() {
        const modalContent = await this.getModalContent();
        if (!modalContent) return false;
        
        const delegateButton = await modalContent.$<HTMLButtonElement>(this.DELEGATE_BUTTON);
        if (!delegateButton) return false;

        try {
            const keplrPopup = await KeplrPopup.openPopupByClikingButton(delegateButton, this.page);
            await keplrPopup.approveTransaction();
            return true;
        } catch (e) {
            // Log this error
            return false;
        }
    }

    private async clickOnMaxAmountToDelegate() {
        const modalContent = await this.getModalContent();
        if (!modalContent) return;
        
        const buttonMaxAmount = await modalContent.$('.form-group button');
        if (!buttonMaxAmount) return; 
        await buttonMaxAmount.click();
    }

    private async getValidatorHTMLRowElement(validatorName: string): Promise<ElementHandle<HTMLTableRowElement> | null> {
        const validators = await this.getValidatorsHTMLRowElement();
        if (!validators) return null;
        let indexValidator = 0;
        let found = false;

        while(found == false || indexValidator < validators.length) {
            found = await this.page.evaluate((tableRowEl: HTMLTableRowElement, validatorName: string) => {
                const [name] = tableRowEl.cells;
                if (name.innerText === validatorName) {
                    return true;
                }
                return false;
            }, validators[indexValidator], validatorName);
            
            indexValidator++;
        }
        return validators[indexValidator - 1];
    }

    private async getValidatorsHTMLRowElement(): Promise<ElementHandle<HTMLTableRowElement>[] | null> {
        const dataContainer = await this.page.$<HTMLDivElement>(this.DATA_CONTAINER);
        if (!dataContainer) return null;

        const validatorsHTMLRowElement = await dataContainer.$$<HTMLTableRowElement>(this.TABLE_ROW_ELEMENTS);
        return validatorsHTMLRowElement;
    }

    private orderValidatorsAsc() {
        this.validators.sort((validatorA, validatorB) => validatorA.getAmountStaked() - validatorB.getAmountStaked());
    }

}

export { DelegateReward }