class PropertyParameter {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}
class ICalProp {
    propertyType: string;
    propertyParams: Map<string, PropertyParameter>
    propertyValueList: string[]
    constructor(key: string, value: string) {
        const splitKey = key.split(";");
        this.propertyType = splitKey[0];
        this.propertyParams = splitKey.slice(1)
            .map((param: string): string[] => param.split("="))
            .map((param: string[]): PropertyParameter => new PropertyParameter(param[0], param[1]))
            .reduce(
                (map, propertyParameter) => {
                    return map.set(propertyParameter.key, propertyParameter);
                }
                , new Map<string, PropertyParameter>()
            );

        // construct a value list ('value' has a comma separated value list)
        // commas could be escaped in 'value' by quotes
        let insideQuotes: boolean = false;
        this.propertyValueList = [];
        let currStringBuilder: string[] = [];

        for(let i: number = 0; i < value.length; i++) {
            if(value[i] === '"') {
                insideQuotes = !insideQuotes;
            }
            else if(value[i] === ',' && insideQuotes) {
                this.propertyValueList.push(currStringBuilder.join(''));
                continue;
            }
            currStringBuilder.push(value[i]);
        }
        this.propertyValueList.push(currStringBuilder.join(''));
    }
}
export {ICalProp};