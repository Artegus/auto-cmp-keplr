class PageNotFound extends Error {

    constructor(message: string) {
        super();
        this.message = `[Error]: Page element not found. ${message}`;
        this.name = this.constructor.name;
    }

}

export { PageNotFound }