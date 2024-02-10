import {ReactComponentElement} from "react";
import {ICalEvent} from "../util/ical-parser/ICalEvent";

interface ICalEventWrapper {
    iCalEvent: ICalEvent;
}
const ICalEventComponent = (iCalEventWrapper: ICalEventWrapper) => {
    const iCalEvent = iCalEventWrapper.iCalEvent;
    return <div>
        <>
        Event:
        {iCalEvent.dateTimeStart?.toISOString()};
        {iCalEvent.dateTimeEnd?.toISOString()}
        {iCalEvent.organizer.map((item) => (
            <div>
                {item}
            </div>
        ))}
        {iCalEvent.summary}
        {iCalEvent.location}
        {iCalEvent.description}
        </>
    </div>;
}


export{ICalEventComponent};