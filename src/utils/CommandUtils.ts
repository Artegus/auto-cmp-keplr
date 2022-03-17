import { spawn, ChildProcess } from 'child_process';
import { Command } from '../models/Command';


class CommandUtil {

    static spawnAsync(command: Command): Promise<string> {
        let prc: ChildProcess;

        let cmd = command.getCommand();
        let args = command.getArgs();
        let opts = command.getOptions();

        if (command.hasArgs()) {
            if (command.hasOptions()) {
                prc = spawn(cmd, args!, opts!);
            } else {
                prc = spawn(cmd, args);
            }
        } else {
            if (command.hasOptions()) {
                prc = spawn(cmd, opts!);
            } else {
                prc = spawn(cmd);
            }
        }

        return new Promise<string>(CommandUtil.executeChildProcess(prc));
    }

    private static executeChildProcess(prc: ChildProcess): (resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void) => void {
        return (resolve, reject) => {
            let res: string = "";
            if (prc.stdout) {
                prc.stdout.setEncoding('utf-8');
                prc.stdout.on('data', (data: string) => res += data);
            }
            if (prc.stderr) {
                prc.stderr.setEncoding('utf-8');
            }
            prc.on('close', (code) => {
                if (code === 0) {
                    resolve(res);
                } else {
                    reject();
                }
            });

        };
    }
}

export { CommandUtil }