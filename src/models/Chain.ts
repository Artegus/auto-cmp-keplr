
class Chain {

    private url: string;
    private favorite: boolean;

    constructor(url: string, isFavorite: boolean) {
        this.url = url;
        this.favorite = isFavorite;
    }

    public getUrl(): string {
        return this.url;
    }

    public isFavorite(): boolean {
        return this.favorite;
    }

}

export { Chain }