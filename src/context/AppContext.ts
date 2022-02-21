import { Context } from "./Context";
import { AppContextStoreKeys } from "./AppContextStoreKeys";
import { FileSystemUtils } from "../utils/FileSystemUtils";
import { config } from "../config";

class AppContext extends Context {

    private homeDir: string;
    private os: NodeJS.Platform;

    constructor() {
        super();
        this.homeDir = FileSystemUtils.getHomeDir();
        this.os = FileSystemUtils.getOsPlatform();
    }

    public getOs() {
        return this.os;
    }

    public getHomeDir() {
        return this.homeDir;
    }

    private setDefaultUserDataDir(): void {
        let path: string[] = [this.homeDir];

        switch(this.os) {
            case "linux":
                path.push(".config/");
            break;
            default:
                throw new Error(`Unable to retrieve the default path for the operating system ${this.os}`);
        }

        path.push(config.browser);

        const defaultDataDir = FileSystemUtils.createPath(...path);

        this.setObject(AppContextStoreKeys.dataDir, defaultDataDir);
    }

    public async loadConfig(): Promise<void> {
        this.setDefaultUserDataDir();
    }

}

export { AppContext }