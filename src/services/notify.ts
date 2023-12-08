import { notify } from "../db/models/notify";
import { Telegraf } from "telegraf";

export class Notify {
    static async notify(bot: Telegraf) {
        return notify(bot);
    }
}
