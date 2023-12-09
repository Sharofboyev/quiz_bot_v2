import { MyTelegraf } from "../modules/telegraf";
import { Track } from "../services";

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
