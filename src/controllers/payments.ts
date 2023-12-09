import { MyTelegraf } from "../modules/telegraf";
import { User, Track } from "../services";
import config from "../config";
import moment from "moment";

export function listenPayments(bot: MyTelegraf) {
    bot.on("successful_payment", async (ctx) => {
        let user = await User.get(ctx.from.id);
        let amount = ctx.message.successful_payment.total_amount / 100;
        if (amount >= config.free_pay1) {
            User.update({
                tg_id: ctx.from.id,
                balance: user.balance + Number(amount) - config.free_pay1,
                free_jump_time: moment().add(config.free_time, "days").toDate(),
            });
        } else if (amount >= config.free_pay2) {
            User.update({
                ...user,
                tg_id: ctx.from.id,
                balance: user.balance + Number(amount) - config.free_pay2,
                free_jumps: user.free_jumps + 11,
            });
        } else if (amount >= config.free_pay3) {
            User.update({
                tg_id: ctx.from.id,
                balance: user.balance + Number(amount) - config.free_pay3,
                free_jumps: user.free_jumps + 6,
            });
        } else {
            User.update({
                tg_id: ctx.from.id,
                balance: user.balance + Number(amount),
            });
        }
    });

    bot.on("pre_checkout_query", (ctx) => {
        Track.add(ctx.preCheckoutQuery, ctx.from.id);
        ctx.answerPreCheckoutQuery(true);
    });
}
