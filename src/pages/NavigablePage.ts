import { Navigable } from "../interfaces/Navigable";
import { AbstractPage } from "./AbstractPage";

abstract class NavigablePage extends AbstractPage implements Navigable {

    abstract startNavigation(): Promise<void>;

}

export { NavigablePage };