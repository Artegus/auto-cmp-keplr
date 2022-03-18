import { ElementHandle, Page } from "puppeteer-core";
import { HTMLElementNotFound } from "../exceptions/HTMLElementNotFound";

type HTMLElements = keyof HTMLElementTagNameMap;

type QuerySelectorByTextOptions<Type extends Element> = {
    element?: ElementHandle | Page; 
    selector: string; 
    text: string;
    pageFuntion: () => (elementHandle: Type, textToFound: string) => boolean;
}

abstract class AbstractPage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected pageQuerySelector<Type extends Element>(selector: string): Promise<ElementHandle<Type>> {
        return this.querySelector(this.page, selector);
    }
    
    protected pageQuerySelectorAll<Type extends Element>(selector: string): Promise<ElementHandle<Type>[]> {
        return this.querySelectorAll<Type>(this.page, selector);
    }

    protected elementQuerySelector<Type extends Element>(elementReference: ElementHandle, selector: string): Promise<ElementHandle<Type>> {
        return this.querySelector<Type>(elementReference, selector);
    }

    protected elementQuerySelectorAll<Type extends Element>(elementReference: ElementHandle, selector: string): Promise<ElementHandle<Type>[]> {
        return this.querySelectorAll<Type>(elementReference, selector);
    }

    protected pageWaitForTimeout(milliseconds: number): Promise<void> {
        return this.page.waitForTimeout(milliseconds);
    }

    protected async querySelectorIncludeText<Type extends Element>({
        element,
        selector,
        text,
        pageFuntion
    }: QuerySelectorByTextOptions<Type>): Promise<ElementHandle<Type>> {

        const possibleElements = await this.querySelectorAll<Type>(element ?? this.page, selector);
        let found: boolean = false;
        let index: number = 0;

        while(found === false && index < possibleElements.length) {
            found = await this.page.evaluate(pageFuntion(), possibleElements[index], text);
            index++;
        }

        if (!found) throw new HTMLElementNotFound(`The ${selector} selector couldn't find the element with innerText: ${text}`); 

        return possibleElements[index - 1];
    }

    private async querySelector<Type extends Element>(elementReference: ElementHandle | Page, selector: string): Promise<ElementHandle<Type>> {
        const element = await elementReference.$<Type>(selector);
        if(element === null) throw new HTMLElementNotFound(`The ${selector} selector couldn't find the element`);
        return element;
    }

    private async querySelectorAll<Type extends Element>(elementReference: ElementHandle | Page, selector: string): Promise<ElementHandle<Type>[]> {
        const elements: ElementHandle<Type>[] = await elementReference.$$(selector);
        if (elements === null) throw new HTMLElementNotFound(`The ${selector} selector couldn't find the element`);
        return elements;
    }

}

export { AbstractPage }