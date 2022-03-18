
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

    public getName(): string {
        const regexChainName = /(?<=\/#\/)(.*)(?=\/stake)/gm;
        const matches = this.getUrl().match(regexChainName);
        let chainName: string;
        
        if (matches) {
            chainName = matches[0];
        } else {
            chainName ="";
        }

        return chainName;
    }

}

export { Chain }