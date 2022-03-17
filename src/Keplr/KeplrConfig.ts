import { FileSystemUtils } from "../utils/FileSystemUtils";
import { config } from '../config';
import { AppContext } from "../context/AppContext";
import { CommandUtil } from "../utils/CommandUtils";
import { Command } from "../models/Command";
import { AppContextStoreKeys } from "../context/AppContextStoreKeys";

type KeplrPaths = {
    extension: string;
    extensionWithVersion: string;
}

class KeplrConfig {

    private extensionsPath: string;
    private paths: KeplrPaths;
    private keplrId: string = config.keplrExtension.id;

    private appContext: AppContext;

    constructor(ctx: AppContext) {
        this.appContext = ctx;
        this.extensionsPath = this.getExtensionsPath();
        this.paths = this.loadPaths();
    }

    public getKeplrExtensionId(): string {
        return this.keplrId;
    }

    public getKeplrPath() {
        return this.paths.extensionWithVersion;
    }

    public getPaths() {
        return this.paths;
    }

    private loadPaths() {
        return {
            extension: this.getKeplrExtensionPath(),
            extensionWithVersion: this.getKeplrExtensionPath() + config.keplrExtension.version
        };
    }

    private getKeplrExtensionPath() {
        return FileSystemUtils.createPath(this.extensionsPath, this.keplrId);
    }
    
    public async loadKeplrExtensionPath(): Promise<void> {
        let keplrExtension = FileSystemUtils.createPath(this.paths.extensionWithVersion);
        
        if (!FileSystemUtils.checkIfExists(keplrExtension)) {
            const keplrId = await this.getKeplrId();
            keplrExtension = FileSystemUtils.createPath(this.paths.extension, keplrId)
        }

        this.paths.extensionWithVersion = keplrExtension;
    }
    
    private getExtensionsPath() {
        const dataDir: string = this.appContext.getObject<string>(AppContextStoreKeys.dataDir)!;
        return FileSystemUtils.createPath(dataDir, "Default", "Extensions");
    }

    private async getKeplrId(): Promise<string> {
        const lsExtPath = new Command('ls', [this.paths.extension]);
        const outputCommand = await CommandUtil.spawnAsync(lsExtPath);

        const dirs = outputCommand.split('\n').filter(dir => dir !== '');

        return dirs[0];
    }

}

export { KeplrConfig }