import { Context } from "./Context";
import { FileSystemUtils } from "../utils/FileSystemUtils";
import { config } from "../config";

class AppContext extends Context {

    private homeDir: string;
    private os: NodeJS.Platform;
    private userDataDir: string;
    private executablePath: string;

    constructor() {
        super();
        this.homeDir = FileSystemUtils.getHomeDir();
        this.os = FileSystemUtils.getOsPlatform();
        this.userDataDir = this.setDefaultUserDataDir();
        this.executablePath = config.executablePath;
    }

    public getOs() {
        return this.os;
    }

    public getHomeDir() {
        return this.homeDir;
    }

    public getUserDataDir() {
        return this.userDataDir;
    }

    public getExecutablePath() {
        return this.executablePath;
    }

    private setDefaultUserDataDir(): string {
        let path: string[] = [this.homeDir];
        //TODO: Add config to others os
        switch(this.os) {
            case "linux":
                path.push(".config/");
            break;
            default:
                throw new Error(`Unable to retrieve the default path for the operating system ${this.os}`);
        }

        path.push(config.browser);

        return FileSystemUtils.createPath(...path);
    }

}

export { AppContext }