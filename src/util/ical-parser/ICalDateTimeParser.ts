import {DateTimeParser, FormattedDateTimeParser} from "../date-parser/DateTimeParser";

const dateTimeParser = new FormattedDateTimeParser("YYYYMMDD-hhmmss");
const dateParser = new FormattedDateTimeParser("YYYYMMDD");

class ICalDateTimeParser implements DateTimeParser {
    private static instance: ICalDateTimeParser;

    private constructor() {

    }

    static getInstance = (): ICalDateTimeParser => {
        if(ICalDateTimeParser.instance === undefined) {
            ICalDateTimeParser.instance = new ICalDateTimeParser();
        }
        return ICalDateTimeParser.instance;
    }
    parse(str: string): Date {
        if(str.includes("T")) {
            return dateTimeParser.parse(str);
        }
        return dateParser.parse(str);
    }
}

export {ICalDateTimeParser};