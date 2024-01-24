import { MyTelegraf } from "../modules/telegraf";
import { CouponService, User } from "../services";
import { CouponType, UserDto, UserState, UserStatus } from "../types";
import { replaceTemplateVars, ru } from "../utils";

export function listenAdminEvents(bot: MyTelegraf) {
    bot.hears(ru.add_question, async (ctx, next) => {
        if (ctx.state.user.status != UserStatus.ADMIN) return next();
        return await ctx.reply(ru.question_types, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: ru.question,
                            callback_data: "question#_#1",
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

    bot.hears(ru.generate_coupon, async (ctx, next) => {
        if (ctx.state.user.status != UserStatus.ADMIN) return next();
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

    bot.action(/question#_#/, async (ctx, next) => {
        ctx.answerCbQuery();
        if (ctx.state.user.status != UserStatus.ADMIN) return next();
        if (!("data" in ctx.callbackQuery)) return; // Just type narrowing here

        let data = Number(
            ctx.callbackQuery.data.substring("question#_#".length)
        );
        if (data || data == 0) {
            await User.update({
                tg_id: ctx.callbackQuery.from.id,
                state: UserState.ADDING_BLITZ + data,
            });
            ctx.reply(ru.send_question, {
                reply_markup: {
                    keyboard: [[{ text: ru.main_menu }]],
                    resize_keyboard: true,
                },
            });
        } else return ctx.reply(ru.not_found);
    });

    bot.action(/coupon#_#/, async (ctx, next) => {
        ctx.answerCbQuery();
        if (ctx.state.user.status != UserStatus.ADMIN) return next();
        if (!("data" in ctx.callbackQuery)) return; // Just type narrowing here

        let coupon_type = ctx.callbackQuery.data.substring(
            "coupon#_#".length
        ) as CouponType;
        const coupon = await CouponService.generateCoupon(coupon_type);
        return ctx.reply(
            replaceTemplateVars(ru.coupon_generated, {
                code: coupon.code,
            }),
            { parse_mode: "Markdown" }
        );
    });
}
