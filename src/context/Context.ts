
class Context {

    private store: Map<string, Object>;

    constructor() {
        this.store = new Map();
    }

    public getStore() {
        return this.store;
    }

    public getObject<T>(key: string): T {
        try {
            return this.store.get(key) as T;
        } catch (e) {
            throw new Error(''); // TODO: Create error
        }
    }

    public getStringValue(key: string): string {
        try {
            return this.store.get(key) as string;
        } catch (e) {
            return "";
        }
    }

    public getBooleanValue(key: string): boolean {
        try {
            return this.store.get(key) as boolean
        } catch (e) {
            return false;
        }
    }

    public setObject(key: string, value: Object): void {
        this.store.set(key, value);
    }


}


export { Context }