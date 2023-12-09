import { NotFoundError } from "../db/models/errors";
import { MyTelegraf } from "../modules/telegraf";
import { User } from "../services";
import { ru } from "../utils";
import { start } from "./start";

export function handleError(bot: MyTelegraf) {
    bot.catch(async (err, ctx) => {
        if (err instanceof NotFoundError) {
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
