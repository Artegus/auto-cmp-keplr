class TargetCreatedException extends Error {

    constructor(message: string) {
        super();
        this.message = `[Error]: on target created. ${message}`;
        this.name = this.constructor.name;
    }

}

export { TargetCreatedException }