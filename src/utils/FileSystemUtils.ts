import fs from 'fs';
import os from 'os';
import _path from 'path';


class FileSystemUtils {

    static checkIfExists(path: string): boolean {
        return fs.existsSync(path);
    }

    static getHomeDir() {
        return os.homedir();
    }

    static getOsPlatform() {
        return os.platform();
    }

    static createPath(...paths: string[]): string {
        const pathJoined = _path.join(...paths)
        return _path.normalize(pathJoined);
    }

}

export { FileSystemUtils }