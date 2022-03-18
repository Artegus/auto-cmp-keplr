import { Process } from "../interfaces/Process";
import { AbstractPage } from "./AbstractPage";

abstract class Processablepage extends AbstractPage implements Process {

    abstract start(): Promise<void>;

}

export { Processablepage };