import { SpawnOptions } from 'child_process';

export type commandOptions = SpawnOptions;

class Command {
    
    private command: string;
    private args?: readonly string[];
    private options?: SpawnOptions

    constructor(command: string, args?: readonly string[], options?: commandOptions) {
        this.command = command;
        this.args = args;
        this.options = options;
    }

    setCommand(command: string): void {
        this.command = command;
    }

    setArgs(args: readonly string[]): void {
        this.args = args;
    }

    setOptions(options: commandOptions) {
        this.options = options;
    }

    getCommand(): string {
        return this.command;
    }

    getArgs(): readonly string[] | undefined {
        return this.args;
    }

    getOptions(): commandOptions | undefined {
        return this.options
    }

    hasArgs(): boolean {
        return this.args !== undefined;
    }

    hasOptions(): boolean {
        return this.options !== undefined; 
    }

    addArg(arg: string): void {
        if (this.args) {
            this.args.concat(arg);
        } else {
            this.args = new Array(arg);
        }
    }

}

export { Command };