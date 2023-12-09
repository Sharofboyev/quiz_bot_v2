import {
    InlineKeyboardButton,
    KeyboardButton,
} from "telegraf/typings/core/types/typegram";
import { MyTelegraf } from "../modules/telegraf";
import { Map, User } from "../services";
import { prepareUserInfo, ru, sender_diary } from "../utils";
import { UserState, changeUser } from "../types";

export function listenUserEvents(bot: MyTelegraf) {
    bot.action(/change#_#\w+/, async (ctx) => {
        ctx.answerCbQuery();
        if (!("data" in ctx.callbackQuery)) return;

        const tg_id = ctx.callbackQuery.from.id;
        let data = ctx.callbackQuery.data.replace("change#_#", "");
        let keyboard: KeyboardButton[][] | null = null;
        if (data in changeUser) {
            await User.update({
                tg_id,
                state: UserState[`CHANGE_` + data.toUpperCase()],
            });
        }
        switch (data) {
            case "martial_status":
                keyboard = [];
                for (let status of ru.martial_statuses) {
                    keyboard.push([{ text: status }]);
                }
                break;
            case "avatar":
                keyboard = [
                    [{ text: ru.cat }, { text: ru.crone }, { text: ru.plane }],
                ];
                break;
            default:
                return ctx.reply(ru.on_error);
        }
        if (keyboard != null) {
            return ctx.reply(ru.ask_edit + ru[data].toLowerCase(), {
                reply_markup: {
                    keyboard: keyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });
        } else ctx.reply(ru.ask_edit + ru[data].toLowerCase());
    });

    bot.hears(ru.diary, async (ctx) => {
        let user = await User.get(ctx.from.id);
        let pages = await User.get_diary(ctx.from.id);

        const message = prepareUserInfo(user);
        ctx.reply(message);
        setTimeout(() => {
            const START_INDEX = 1;
            sender_diary(START_INDEX, pages, ({ message, keyboard }) => {
                ctx.reply(ru.your_steps + message, {
                    reply_markup: { inline_keyboard: keyboard },
                });
            });
        }, 1000);
    });
}
