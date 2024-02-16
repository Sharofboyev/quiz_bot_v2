import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { MyTelegraf } from "../modules/telegraf";
import { User } from "../services";
import { prepareUserInfo, ru, sender_diary } from "../utils";
import { UserDto, UserState, changeUser } from "../types";

export function listenUserEvents(bot: MyTelegraf) {
    bot.action(/change#_#\w+/, async (ctx) => {
        ctx.answerCbQuery();
        if (!("data" in ctx.callbackQuery)) return;

        const tg_id = ctx.callbackQuery.from.id;
        let data = ctx.callbackQuery.data.replace("change#_#", "");
        let keyboard: KeyboardButton[][] | null = null;
        if (changeUser.includes(data)) {
            console.log(UserState[`CHANGE_` + data.toUpperCase()]);
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
        }
        if (!ru[data]) return ctx.reply(ru.on_error);
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
        let { user } = ctx.state as { user: UserDto };
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

    bot.action(/prev/, async (ctx) => {
        const tg_id = ctx.callbackQuery.from.id;
        if (!("data" in ctx.callbackQuery)) return;
        let data = ctx.callbackQuery.data.substring(4);
        const startIndex = Number(data);
        if (data.includes("not"))
            return ctx.answerCbQuery(ru.no_more, {
                cache_time: 2,
                show_alert: false,
            });
        else {
            let pages = await User.get_diary(tg_id);
            sender_diary(startIndex, pages, ({ message, keyboard }) => {
                ctx.editMessageText(message, {
                    reply_markup: { inline_keyboard: keyboard },
                });
            });
        }
    });

    bot.action(/next/, async (ctx) => {
        const tg_id = ctx.callbackQuery.from.id;
        if (!("data" in ctx.callbackQuery)) return;
        let data = ctx.callbackQuery.data.substring(4);
        const startIndex = Number(data);
        if (data.includes("not"))
            return ctx.answerCbQuery(ru.no_more, {
                cache_time: 2,
                show_alert: false,
            });
        else {
            let pages = await User.get_diary(tg_id);
            sender_diary(startIndex, pages, ({ keyboard, message }) => {
                ctx.editMessageText(message, {
                    reply_markup: { inline_keyboard: keyboard },
                });
            });
        }
    });

    bot.hears(ru.settings, async (ctx) => {
        let keyboard = [
            [
                {
                    text: ru.edit + " " + ru.first_name.toLowerCase(),
                    callback_data: "change#_#first_name",
                },
                {
                    text: ru.edit + " " + ru.change_last_name.toLowerCase(),
                    callback_data: "change#_#last_name",
                },
            ],
            [
                {
                    text: ru.edit + " " + ru.avatar.toLowerCase(),
                    callback_data: "change#_#avatar",
                },
            ],
            [
                {
                    text: ru.edit + " " + ru.martial_status.toLowerCase(),
                    callback_data: "change#_#martial_status",
                },
            ],
            [
                {
                    text: ru.edit + " " + ru.game_request.toLowerCase(),
                    callback_data: "change#_#game_request",
                },
                {
                    text: ru.edit + " " + ru.age.toLowerCase(),
                    callback_data: "change#_#age",
                },
            ],
            [
                {
                    text: ru.edit + " " + ru.notification_time.toLowerCase(),
                    callback_data: "change#_#notification_time",
                },
            ],
        ];
        ctx.reply(ru.choose_what, {
            reply_markup: { inline_keyboard: keyboard },
        });
    });
}
