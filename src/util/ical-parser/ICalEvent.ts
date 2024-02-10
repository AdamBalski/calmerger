import {ICalObject} from "./ICalObject";
import {Obj} from "./ICalParser";
import {ICalProp} from "./ICalProp";
import {ICalDateTimeParser} from "./ICalDateTimeParser";


class ICalEvent extends ICalObject {
    dateTimeStart: Date | undefined;
    dateTimeEnd: Date | undefined;
    location: string | undefined;
    organizer: string[];
    summary: string | undefined;
    description: string | undefined;

    constructor(obj: Obj) {
        super();

        let dateTimeParser: ICalDateTimeParser = ICalDateTimeParser.getInstance();
        let dateTimeStartProp: ICalProp | undefined = obj.props.get("DTSTART");
        if(dateTimeStartProp !== undefined) {
            this.dateTimeStart = dateTimeParser.parse(dateTimeStartProp.propertyValueList[0]);
        }
        let dateTimeEndProp: ICalProp | undefined = obj.props.get("DTEND");
        if(dateTimeEndProp !== undefined) {
            this.dateTimeEnd = dateTimeParser.parse(dateTimeEndProp.propertyValueList[0]);
        }
        this.location = obj.props.get("LOCATION")?.propertyValueList[0];

        let organizerName: string[] | undefined = obj.props.get("ORGANIZER")?.propertyValueList;
        let organizerCommonName: string | undefined = obj.props.get("ORGANIZER")?.propertyParams.get("CN")?.value;
        this.organizer = [...(organizerName !== undefined ? organizerName : [])];
        this.organizer.push(...(organizerCommonName !== undefined ? [organizerCommonName] : []));

        this.summary = obj.props.get("SUMMARY")?.propertyValueList[0];
        this.description = obj.props.get("DESCRIPTION")?.propertyValueList[0];
    }

    static valueOf(obj: Obj): ICalObject {
        return new ICalEvent(obj);
    }
}

export {ICalEvent};
