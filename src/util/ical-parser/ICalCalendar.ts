import {Obj} from "./ICalParser";
import {ICalObject} from "./ICalObject";
import {newICalObject} from "./ICalObjectFactory";
import {ICalEvent} from "./ICalEvent";

class ICalCalendar extends ICalObject {
    children: ICalObject[];
    constructor(obj: Obj) {
        super();
        this.children = [];
        for(let child of obj.children) {
            this.children.push(newICalObject(child));
        }
    }

    static valueOf(obj: Obj): ICalObject {
        return new ICalCalendar(obj);
    }

    // getEvents that start or end within the (dateStart, dateEnd) period
    getEvents = (dateStart: Date, dateEnd: Date): ICalEvent[] => {
        const dateIsBetween = (date: Date) => {
            return dateStart < date && date < dateEnd;
        };
        const eventIsWithin = (eventDateStart: Date, eventDateEnd: Date): boolean => {
            return dateIsBetween(eventDateStart) && dateIsBetween(eventDateEnd);
        }

        const events: ICalEvent[] = [];
        for(let event of this.children
            .filter(object => typeof(object) == typeof(ICalEvent))
            .map(object => object as ICalEvent)
        ) {
            if(event.dateTimeStart === undefined || event.dateTimeEnd === undefined) {
                continue;
            }
            if(eventIsWithin(event.dateTimeStart, event.dateTimeEnd)) {
                events.push(event);
            }
        }

        return events;
    }
}
export{ICalCalendar};