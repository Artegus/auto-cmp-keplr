import { Page } from "puppeteer-core";

abstract class AbstractPage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

}

export { AbstractPage }