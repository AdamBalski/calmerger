import {ICalCalendar} from "../util/ical-parser/ICalCalendar";
import {ICalEvent} from "../util/ical-parser/ICalEvent";
import {ICalEventComponent} from "./ICalEventComponent";

interface ICalCalendarWrapper {
    iCalCalendar: ICalCalendar;
}
const ICalCalendarComponent = (iCalCalendarWrapper: ICalCalendarWrapper) => {
    console.log("in ICalCalendar");
    const iCalCalendar = iCalCalendarWrapper.iCalCalendar;
    return <>
        {iCalCalendar.children
            .filter(child => child instanceof ICalEvent)
            .map(child => child as ICalEvent)
            .map(child => {
                console.log("lol");
                return <ICalEventComponent iCalEvent={child}></ICalEventComponent>;
            })
        }
    </>;
}
export {ICalCalendarComponent};