class Context {

    private store: Map<string, Object>;

    constructor() {
        this.store = new Map();
    }

    public getStore() {
        return this.store;
    }

    public getObject<T>(key: string): T | undefined {
        try {
            return this.store.get(key) as T;
        } catch (e) {
            return undefined;
        }
    }

    public setObject(key: string, value: Object): void {
        this.store.set(key, value);
    }


}


export { Context }