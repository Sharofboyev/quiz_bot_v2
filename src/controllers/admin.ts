import { MyTelegraf } from "../modules/telegraf";
import { User } from "../services";
import { CouponType } from "../types";
import { ru } from "../utils";

export function listenAdminEvents(bot: MyTelegraf) {
    bot.hears(ru.add_question, async (ctx) => {
        return await ctx.reply(ru.question_types, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: ru.question,
                            callback_data: "coupon#_#1",
                        },
                        {
                            text: ru.thankful,
                            callback_data: "question#_#2",
                        },
                        {
                            text: ru.exercise,
                            callback_data: "question#_#3",
                        },
                    ],
                    [
                        {
                            text: ru.capital_question,
                            callback_data: "question#_#0",
                        },
                    ],
                ],
            },
        });
    });

    bot.hears(ru.generate_coupon, async (ctx) => {
        return await ctx.reply(ru.coupon_types, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: ru.coupon_free_jump,
                            callback_data: `coupon#_#${CouponType.FREE_JUMP}`,
                        },
                        {
                            text: ru.coupon_free_level,
                            callback_data: `coupon#_#${CouponType.FREE_LEVEL}`,
                        },
                    ],
                ],
            },
        });
    });
}
