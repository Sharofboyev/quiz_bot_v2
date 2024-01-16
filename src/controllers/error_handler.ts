import { NotFoundError, UserNotFoundError } from "../db/models/errors";
import { MyTelegraf } from "../modules/telegraf";
import { User } from "../services";
import { ru } from "../utils";
import { start } from "./start";

export function handleError(bot: MyTelegraf) {
    bot.on("text", (ctx) => {
        ctx.reply(ru.no_such_keyboard);
    });

    bot.catch(async (err, ctx) => {
        console.log("Bot.catch");
        console.log(err);
        if (err instanceof UserNotFoundError) {
            const from =
                ctx.from ||
                ctx.callbackQuery?.from ||
                ctx.chosenInlineResult?.from ||
                ctx.message?.from;
            if (!from) {
                ctx.reply(ru.on_error);
                return;
            }
            await User.add({
                first_name: from.first_name,
                tg_id: from.id,
                last_name: from.last_name,
            });
            return start(ctx, from);
        }
        ctx.reply(ru.on_error).catch((err) => {
            return console.log(err);
        });
    });
}
