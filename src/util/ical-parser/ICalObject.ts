import {Obj} from "./ICalParser";

class ICalObject {
    children: ICalObject[];

    constructor() {
        this.children = [];
    }
}

export {ICalObject};