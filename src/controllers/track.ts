import { NotFoundError, UserNotFoundError } from "../db/models/errors";
import { MyTelegraf } from "../modules/telegraf";
import { Track, User } from "../services";
import { ru } from "../utils";
import { start } from "./start";

export function trackBot(bot: MyTelegraf) {
    bot.use((ctx, next) => {
        if (ctx.from) {
            Track.add(
                ctx.message || ctx.callbackQuery || ctx.preCheckoutQuery,
                ctx.from.id
            );
        }
        return next();
    });
}
