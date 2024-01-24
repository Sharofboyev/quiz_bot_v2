import { MyTelegraf } from "../modules/telegraf";
import { Track, User } from "../services";

export function trackBot(bot: MyTelegraf) {
    bot.use(async (ctx, next) => {
        if (ctx.from) {
            Track.add(
                ctx.message || ctx.callbackQuery || ctx.preCheckoutQuery,
                ctx.from.id
            );

            const user = await User.get(ctx.from.id);
            ctx.state.user = user;
        }
        return next();
    });
}
