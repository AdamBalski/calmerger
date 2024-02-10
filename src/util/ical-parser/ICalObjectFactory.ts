import {ICalObject} from "./ICalObject";
import {Obj} from "./ICalParser";
import {ICalUnknownTypeObject} from "./ICalUnkownTypeObject";
import {ICalEvent} from "./ICalEvent";
import {ICalCalendar} from "./ICalCalendar";

const newICalObject = (obj: Obj): ICalObject => {
    if(obj.type === "VCALENDAR") {
        return ICalCalendar.valueOf(obj);
    }
    if(obj.type === "VEVENT") {
        return ICalEvent.valueOf(obj);
    }
    return ICalUnknownTypeObject.valueOf(obj);
}

export {newICalObject};