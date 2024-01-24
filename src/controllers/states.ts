import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { MyTelegraf } from "../modules/telegraf";
import { CouponService, Map, QuestionService, User } from "../services";
import {
    Avatar,
    CouponType,
    MartialStatus,
    QuestType,
    UserDto,
    UserState,
    UserStatus,
} from "../types";
import { convertToAvatar, replaceTemplateVars, ru } from "../utils";
import { start } from "./start";
import Joi from "joi";
import moment from "moment";
import { CouponNotFoundError } from "../db/models/errors";

export async function states(bot: MyTelegraf) {
    bot.use(async (ctx, next) => {
        let tg_id = ctx.from?.id as number;
        let { user } = ctx.state as { user: UserDto };
        let state = user.state;
        const from = {
            id: tg_id,
            first_name: user.first_name,
            last_name: user.last_name,
        };
        let message = ctx.message
            ? (ctx.message as { text?: string }).text
            : undefined;
        if (message == ru.main_menu) {
            User.update({ tg_id, state: UserState.IDLE });
            return start(ctx, from);
        }
        if (state == UserState.NEW_USER) {
            await ctx.reply(ru.welcome);
            setTimeout(async () => {
                ctx.reply(ru.get_name);
                await User.update({ tg_id, state: UserState.ASKED_NAME });
            }, 5000);
        } else if (state == UserState.ASKED_NAME) {
            const { error, value } = Joi.string().required().validate(message);
            if (error || value == "/start") {
                ctx.reply(ru.welcome);
                return setTimeout(async () => {
                    ctx.reply(ru.get_name);
                    return await User.update({
                        tg_id,
                        state: UserState.ASKED_NAME,
                    });
                }, 5000);
            }
            let name = value.split(" ");
            await User.update({
                tg_id,
                first_name: name[0],
                last_name: name[1],
                state: UserState.ASKED_AGE,
            });
            return ctx.reply(ru.get_age);
        } else if (state == UserState.ASKED_AGE) {
            const { error, value } = Joi.number().required().validate(message);
            if (error) return ctx.reply(ru.get_age);
            await User.update({
                tg_id,
                age: Number(value),
                state: UserState.ASKED_MARTIAL_STATUS,
            });
            let keyboard: KeyboardButton[][] = [];
            for (let martialStatus of ru.martial_statuses) {
                keyboard.push([{ text: martialStatus }]);
            }
            return ctx.reply(ru.get_martial_status, {
                reply_markup: {
                    keyboard: keyboard,
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });
        } else if (state == UserState.ASKED_MARTIAL_STATUS) {
            const { error, value } = Joi.string<MartialStatus>()
                .required()
                .validate(message);
            if (error || !ru.martial_statuses.includes(value)) {
                let keyboard: KeyboardButton[][] = [];
                for (let martialStatus of ru.martial_statuses) {
                    keyboard.push([{ text: martialStatus }]);
                }
                return ctx.reply(ru.get_martial_status, {
                    reply_markup: {
                        keyboard: keyboard,
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
            }
            await User.update({
                tg_id,
                state: UserState.ASKED_GAME_REQUEST,
                martial_status: value,
            });

            return ctx.reply(ru.request_to_game);
        } else if (state == UserState.ASKED_GAME_REQUEST) {
            const { error, value } = Joi.string().required().validate(message);
            if (error) {
                return ctx.reply(ru.request_to_game);
            }
            await User.update({
                tg_id,
                game_request: value,
                state: UserState.ASKED_TO_CHOOSE_AVATAR,
            });
            const { image } = await Map.get_cell_info(0, Avatar.AVATARS, 0);
            ctx.replyWithPhoto(image, {
                caption: ru.choose_avatar,
                reply_markup: {
                    keyboard: [
                        [
                            { text: ru.cat },
                            { text: ru.crone },
                            { text: ru.plane },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });
        } else if (state == UserState.ASKED_TO_CHOOSE_AVATAR) {
            const { error, value: ruAvatar } = Joi.string()
                .required()
                .validate(message);
            if (
                error ||
                (ruAvatar != ru.plane &&
                    ruAvatar != ru.cat &&
                    ruAvatar != ru.crone)
            ) {
                const { image } = await Map.get_cell_info(0, Avatar.AVATARS, 0);
                return ctx.replyWithPhoto(image, {
                    caption: ru.choose_avatar,
                    reply_markup: {
                        keyboard: [
                            [
                                { text: ru.cat },
                                { text: ru.crone },
                                { text: ru.plane },
                            ],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
            }
            await User.update({
                tg_id,
                status: UserStatus.PLAYER,
                avatar: convertToAvatar(ruAvatar),
                state: UserState.CAPITAL_START,
            });
            await ctx.reply(ru.game_capital);
            let question = await QuestionService.get_new_question({
                tg_id,
                type: QuestType.BLITZ,
                blitz_question_id: 1,
            });
            setTimeout(async () => {
                await ctx.reply(ru.capital_start);
                ctx.reply("1. " + question.text, {
                    reply_markup: {
                        keyboard: [[{ text: ru.yes }, { text: ru.no }]],
                        resize_keyboard: true,
                    },
                });
            }, 1500);
        } else if (state == UserState.ADDING_QUESTION) {
            const { error, value } = Joi.string().required().validate(message);
            if (error) return ctx.reply(ru.send_question);
            await QuestionService.add(
                value,
                user.state - UserState.ADDING_BLITZ
            );
            await User.update({
                tg_id: user.tg_id,
                state: UserState.IDLE,
            });
            start(ctx, from, ru.success_addition);
        } else if (state == UserState.CHANGE_FIRST_NAME) {
            const { error, value } = Joi.string().required().validate(message);
            if (error) {
                return ctx.reply(ru.wrong_value);
            }
            await User.update({
                tg_id,
                first_name: value,
                state: UserState.IDLE,
            });
            return start(ctx, from, ru.successful_edit);
        } else if (state == UserState.CHANGE_LAST_NAME) {
            const { error, value } = Joi.string().required().validate(message);
            if (error) {
                return ctx.reply(ru.wrong_value);
            }
            await User.update({
                tg_id,
                last_name: value,
                state: UserState.IDLE,
            });
            return start(ctx, from, ru.successful_edit);
        } else if (state == UserState.CHANGE_AGE) {
            const { error, value } = Joi.number()
                .integer()
                .required()
                .max(120)
                .min(1)
                .validate(message);
            if (error) {
                return ctx.reply(ru.wrong_value);
            }
            await User.update({ tg_id, age: value, state: UserState.IDLE });
            start(ctx, from, ru.successful_edit);
        } else if (state == UserState.CHANGE_MARTIAL_STATUS) {
            const { error, value } = Joi.string<MartialStatus>()
                .required()
                .validate(message);
            if (error || !ru.martial_statuses.includes(value))
                return ctx.reply(ru.wrong_value);
            await User.update({
                tg_id,
                state: UserState.IDLE,
                martial_status: value,
            });
            start(ctx, from, ru.successful_edit);
        } else if (state == UserState.CHANGE_GAME_REQUEST) {
            const { error, value } = Joi.string().required().validate(message);
            if (error) {
                return ctx.reply(ru.wrong_value);
            }
            await User.update({
                tg_id,
                game_request: value,
                state: UserState.IDLE,
            });
            start(ctx, from, ru.successful_edit);
        } else if (state == UserState.CHANGE_AVATAR) {
            const { error, value } = Joi.string().required().validate(message);
            if (
                error ||
                (value != ru.plane && value != ru.cat && value != ru.crone)
            ) {
                return ctx.reply(ru.wrong_value);
            }
            await User.update({
                tg_id,
                status: 1,
                avatar: convertToAvatar(value),
                state: UserState.IDLE,
            });
            start(ctx, from, ru.successful_edit);
        } else if (state == UserState.CHANGE_NOTIFICATION_TIME) {
            const time = moment(message, "HH:mm");
            if (!time.isValid()) {
                return ctx.reply(ru.wrong_value);
            }
            await User.update({
                tg_id,
                notification_time: time.format("HH:mm"),
                state: UserState.IDLE,
            });
            start(ctx, from, ru.successful_edit);
        } else if (
            state >= UserState.CAPITAL_LOWER_LIMIT &&
            state <= UserState.CAPITAL_UPPER_LIMIT
        ) {
            const { error, value } = Joi.string()
                .required()
                .valid(ru.yes, ru.no)
                .validate(message);
            if (error)
                return ctx.reply(ru.wrong_value, {
                    reply_markup: {
                        keyboard: [[{ text: ru.yes }, { text: ru.no }]],
                        resize_keyboard: true,
                    },
                });
            if (value == ru.yes) user.energy += 1;
            state += 1;
            await User.update({
                tg_id,
                state: state,
                energy: user.energy,
            });
            if (state == UserState.CAPITAL_UPPER_LIMIT) {
                await User.update({ tg_id, state: UserState.IDLE });
                return start(
                    ctx,
                    from,
                    replaceTemplateVars(ru.end_capital, { energy: user.energy })
                );
            }
            let question = await QuestionService.get_new_question({
                tg_id,
                type: QuestType.BLITZ,
                blitz_question_id: state - UserState.CAPITAL_LOWER_LIMIT,
            });
            ctx.reply(
                `${state - UserState.CAPITAL_LOWER_LIMIT}. ` + question.text,
                {
                    reply_markup: {
                        keyboard: [[{ text: ru.yes }, { text: ru.no }]],
                        resize_keyboard: true,
                    },
                }
            );
        } else if (state == UserState.ACTIVATING_COUPON) {
            const { error, value } = Joi.string()
                .length(16)
                .required()
                .validate(message);
            if (error) {
                return ctx.reply(ru.wrong_value);
            }

            try {
                const coupon = await CouponService.getCoupon(value);
                if (
                    (coupon.type == CouponType.FREE_LEVEL && user.free_level) ||
                    coupon.used
                ) {
                    await User.update({
                        tg_id,
                        state: UserState.IDLE,
                    });
                    return start(ctx, from, ru.coupon_allowed_only_once);
                }

                await CouponService.activateCoupon(value, tg_id);
                if (coupon.type === CouponType.FREE_JUMP) {
                    await User.update({
                        tg_id,
                        state: UserState.IDLE,
                        free_jumps: user.free_jumps + 3,
                    });
                } else
                    await User.update({
                        tg_id,
                        state: UserState.IDLE,
                        free_level: 1,
                    });
                return start(ctx, from, ru.coupon_activated);
            } catch (err) {
                if (err instanceof CouponNotFoundError) {
                    return ctx.reply(ru.coupon_not_found);
                } else throw err;
            }
        } else return next();
    });
}
