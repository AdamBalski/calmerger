// import {ICal} from "./ICal";

import {ICalProp} from "./ICalProp";
import {ICalObject} from "./ICalObject";
import {newICalObject} from "./ICalObjectFactory";
import {ICalCalendar} from "./ICalCalendar";
import {ICalEvent} from "./ICalEvent";


// todo parse "RRULE:FREQ=WEEKLY;UNTIL=20240125T133000Z;BYDAY=TH;WKST=MO"
// todo parse "EXDATE;TZID=Europe/Warsaw:20231102T130000,20231228T130000"
class Obj {
    props: Map<string, ICalProp>;
    type: string;
    children: Obj[];

    constructor(type: string) {
        this.props = new Map<string, ICalProp>();
        this.children = [];
        this.type = type;
    }
}

//  RFC5545/Page 9
//  When parsing a content line, folded lines MUST first
//      ; be unfolded according to the unfolding procedure
//      ; described above.  When generating a content line, lines
//      ; longer than 75 octets SHOULD be folded according to
//      ; the folding procedure described above.
const unfoldLines = (lines: string[]): string[] => {
    const result: string[] = [];
    for(let currLine of lines) {
        if(currLine.trimStart() !== currLine) {
            result[result.length - 1] = result[result.length - 1] + currLine.trim();
        }
        else {
            result.push(currLine.trim())
        }
    }

    return result;
}


// result: arrays of string tuples [KEY, VALUE], for example ["BEGIN", "VEVENT"]
const tokenize = (iCalFile: string): string[][] => {
    return unfoldLines(iCalFile.split("\n"))
        .map((line: string): string[] => line.split(":"))
        .map((line: string[]): string[] => [line[0], line.slice(1).join(":")]);
}

const parseWebcal = (iCalFile: string): ICalCalendar => {
    const tokenizedLines: string[][] = tokenize(iCalFile);

    const root: Obj = new Obj("ROOT");
    const objStack: Obj[] = [root];

    let idx: number = 0;
    while(idx < tokenizedLines.length) {
        const [key, value]: string[] = tokenizedLines[idx];
        if(key === "BEGIN") {
            objStack.push(new Obj(value));
        }
        else if(key === "END") {
            const poppedObject: Obj | undefined = objStack.pop();
            if(poppedObject === undefined) {
                throw new Error("File not parsable");
            }
            objStack[objStack.length - 1].children.push(poppedObject);
        }
        else {
            let iCalProp = new ICalProp(key, value);
            objStack[objStack.length - 1].props.set(iCalProp.propertyType, iCalProp);
        }
        idx++;
    }

    return ICalCalendar.valueOf(root.children[0]) as ICalCalendar;
}

export{parseWebcal, Obj};