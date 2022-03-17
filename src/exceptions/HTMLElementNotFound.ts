class HTMLElementNotFound extends Error {

    constructor(message: string) {
        super();
        this.message = `[Error]: HTML element not found. ${message}`;
        this.name = this.constructor.name;
    }

}

export { HTMLElementNotFound }