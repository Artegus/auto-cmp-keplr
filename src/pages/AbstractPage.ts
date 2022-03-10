import { ElementHandle, Page } from "puppeteer-core";
import { HTMLElementNotFound } from "../errors/HTMLElementNotFound";

type HTMLElements = keyof HTMLElementTagNameMap;

abstract class AbstractPage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async pageQuerySelector<Type extends Element>(selector: string): Promise<ElementHandle<Type>> {
        return this.querySelector(this.page, selector);
    }
    
    async pageQuerySelectorAll<Type extends Element>(selector: string): Promise<ElementHandle<Type>[]> {
        return this.querySelectorAll<Type>(this.page, selector);
    }

    async pageQuerySelectorIncludeText<Type extends Element>(selector: string, text: string): Promise<ElementHandle<Type>> {
        return this.querySelectorIncludeText<Type>(this.page, selector, text);
    }
    
    async elementQuerySelector<Type extends Element>(elementReference: ElementHandle, selector: string): Promise<ElementHandle<Type>> {
        return this.querySelector<Type>(elementReference, selector);
    }

    async elementQuerySelectorAll<Type extends Element>(elementReference: ElementHandle, selector: string): Promise<ElementHandle<Type>[]> {
        return this.querySelectorAll<Type>(elementReference, selector);
    }

    async elementQuerySelectorIncludeText<Type extends Element>(elementReference: ElementHandle, selector: string, text: string): Promise<ElementHandle<Type>>{
        return this.querySelectorIncludeText<Type>(elementReference, selector, text);
    }

    private async querySelectorIncludeText<Type extends Element>(element: ElementHandle | Page, selector: string, text: string): Promise<ElementHandle<Type>> {
        const possibleElements = await this.querySelectorAll<Type>(element, selector);
        let found: boolean = false;
        let index: number = 0;

        while(found === false || index < possibleElements.length) {
            found = await this.page.evaluate((btn: HTMLButtonElement, textToFound: string) => {
                return btn.innerText === textToFound;
            }, possibleElements[index], text);
            
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
        if (elements === null) throw new HTMLElementNotFound('');
        return elements;
    }

}

export { AbstractPage }