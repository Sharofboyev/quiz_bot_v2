import { track } from "../db/models/track";
import _ from "lodash";

export class Track {
    static async add(data: any, from: any) {
        data = _.omit(data, ["from", "chat"]);
        track(data, from);
    }
}
