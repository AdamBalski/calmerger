import {ICalObject} from "./ICalObject";
import {Obj} from "./ICalParser";

class ICalUnknownTypeObject extends ICalObject {
    obj: Obj;
    constructor(obj: Obj) {
        super();
        this.obj = obj;
    }
    static valueOf(obj: Obj): ICalUnknownTypeObject {
        return new ICalUnknownTypeObject(obj);
    }
}

export {ICalUnknownTypeObject};