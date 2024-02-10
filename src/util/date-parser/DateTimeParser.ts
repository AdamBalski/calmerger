// M - month
// D - day
// Y - year
// s - second
// m - minutes
// h - hours
// - - omit
interface DateTimeParser {
    parse: (str: string) => Date;
}

class FormattedDateTimeParser implements DateTimeParser {
    format: string;
    constructor(format: string) {
        this.format = format;
    }

    parse(str: string): Date {
        let data = new Map<string, number>();

        const min = (a: number, b: number) => a < b ? a : b;
        for(let i: number = 0; i < min(str.length, this.format.length); i++) {
            let value: number | undefined = data.get(this.format[i]);
            if(value === undefined) {
                value = 0;
            }
            value = 10 * value + Number(str[i]);
            data.set(this.format[i], value);
        }

        const valueOrDefault = (value: number | undefined, preselected: number): number => {
            return value === undefined ? preselected : value;
        }
        return new Date(
            valueOrDefault(data.get("Y"), 0),
            valueOrDefault(data.get("M"), 1) - 1,
            data.get("D"),
            data.get("h"),
            data.get("m"),
            data.get("s")
        );
    }
}

export {FormattedDateTimeParser};
export type { DateTimeParser };
