// import {ICal} from "./ICal";
// import {AxiosResponse} from "axios";
// import axios from "axios";
// import { Calendar, types } from "icalendarts";
//
// const makeProtocolHttp = (url: string): string => {
//     // change webcal protocol to http protocol in the link
//     // if link doesn't have a protocol, append http:// in front
//     if(url.startsWith("webcal")) {
//         url.replace(new RegExp("webcals*", ""), "http");
//     }
//     else if(!url.startsWith("http://") && !url.startsWith("https://")) {
//         url = "http://" + url;
//     }
//     return "";
// }
//
// const fetch = async (url: string): Promise<string | null> => {
//     url = makeProtocolHttp(url);
//     let result = null;
//     await axios(url)
//         .then((value: AxiosResponse) => {
//             result = ical.parseICS(value.data);
//         });
//     console.log(result);
//     return result;
// };
//
// export {fetch};
export{};