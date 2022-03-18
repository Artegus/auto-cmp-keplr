import { ElementHandle } from 'puppeteer-core';
import { IValidator, Validator } from '../../models/Validator';
import { KeplrPopup } from '../KeplrPopup';
import { Processablepage } from '../ProcessablePage';

class DelegateReward extends Processablepage {

    private validators: Validator[] = [];

    private readonly DATA_CONTAINER = '.main-content > .container-fluid > .row > .col-lg-12 > .card';
    private readonly TABLE_ROW_ELEMENTS = '.card-body > table > .list tr';
    private readonly MODAL_CONTENT = '.modal-content > div > div';
    private readonly DELEGATE_TEXT = 'Delegate';

    public async start() {
        await this.retrieveValidators();
        const validator = this.selectValidorWithLowestAmountStaked();
        await this.delegate(validator);
    }

    private async retrieveValidators(): Promise<void> {
        const validators = await this.getValidatorsHTMLRowElement();

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

    private async delegate(validator: Validator): Promise<void> {
        await this.clickOnManageValidator(validator.getName());
        await this.clickOnDelegate();
        await this.clickOnMaxAmountToDelegate();
        return this.clickOnDelegateAndManagePopup();
    }

    async getModalContent(): Promise<ElementHandle<HTMLDivElement>> {
        return this.pageQuerySelector<HTMLDivElement>(this.MODAL_CONTENT);
    }

    async clickOnManageValidator(validatorName: string): Promise<void> {
        const validatorHTMLRowElement = await this.getValidatorHTMLRowElement(validatorName);
        const manageButton = await this.elementQuerySelector<HTMLButtonElement>(validatorHTMLRowElement, 'button');
        await manageButton.click();
        await this.pageWaitForTimeout(1000);
    }

    private async clickOnDelegate() {
        const modalContent = await this.getModalContent();
        const delegateButton = await this.getDelegateButton(modalContent);
        await delegateButton.click();
    }

    private async getDelegateButton(modalContent: ElementHandle<HTMLDivElement>): Promise<ElementHandle<HTMLButtonElement>> {
        return this.querySelectorIncludeText<HTMLButtonElement>({
            element: modalContent, 
            selector: 'button', 
            text: this.DELEGATE_TEXT,
            pageFuntion: searchInnerTextButton
        });

        function searchInnerTextButton(): (element: HTMLButtonElement, textToSeach: string) => boolean {
            return (element: HTMLButtonElement, textToSeach: string) => {
                return element.innerText === textToSeach;
            };
        }

    }

    private async clickOnDelegateAndManagePopup(): Promise<void> {
        const modalContent = await this.getModalContent();
        const delegateButton = await this.getDelegateButton(modalContent);
        const keplrPopup = await KeplrPopup.openPopupByClikingButton(delegateButton, this.page);
        await keplrPopup.approveTransaction();
    }

    private async clickOnMaxAmountToDelegate(): Promise<void> {
        const modalContent = await this.getModalContent();
        const buttonMaxAmount = await this.elementQuerySelector(modalContent, '.form-group button');
        await buttonMaxAmount.click();
        await this.pageWaitForTimeout(1000);
    }

    private async getValidatorHTMLRowElement(validatorName: string): Promise<ElementHandle<HTMLTableRowElement>> {
        function searchInnerTextIntoHTMLTableCell(): (element: HTMLTableRowElement, textToSeach: string) => boolean {
            return (element: HTMLTableRowElement, textToSeach: string) => {
                const [name] = element.cells;
                return name.innerText === textToSeach;
            };
        }

        const containerElement = await this.pageQuerySelector<HTMLDivElement>(this.DATA_CONTAINER);

        const validator = await this.querySelectorIncludeText({
            element: containerElement, 
            selector: this.TABLE_ROW_ELEMENTS, 
            text: validatorName,
            pageFuntion: searchInnerTextIntoHTMLTableCell
        });

        return validator;

    }

    private async getValidatorsHTMLRowElement(): Promise<ElementHandle<HTMLTableRowElement>[]> {
        const containerElement = await this.pageQuerySelector<HTMLDivElement>(this.DATA_CONTAINER);
        return this.elementQuerySelectorAll<HTMLTableRowElement>(containerElement, this.TABLE_ROW_ELEMENTS);
    }

    private orderValidatorsAsc() {
        this.validators.sort((validatorA, validatorB) => validatorA.getAmountStaked() - validatorB.getAmountStaked());
    }

}

export { DelegateReward }