import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { CustomContext, MyTelegraf } from "../modules/telegraf";
import { Map, QuestionService, User } from "../services";
import {
    Avatar,
    MartialStatus,
    QuestType,
    UserDto,
    UserState,
    UserStatus,
} from "../types";
import { convertToAvatar, ru } from "../utils";
import { start } from "./start";
import Joi from "joi";

export function listenStates(bot: MyTelegraf) {}

async function states(
    ctx: CustomContext,
    next: Function,
    state: UserState,
    user: UserDto
) {
    let tg_id = user.tg_id;
    let message = (ctx.message as { text: string }).text;
    if (message == ru.main_menu) {
        User.update({ tg_id, state: UserState.IDLE });
        return start(ctx, {
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.tg_id,
        });
    }
    if (state == UserState.NEW_USER) {
        await ctx.reply(ru.welcome);
        setTimeout(async () => {
            ctx.reply(ru.get_name);
            await User.update({ tg_id, state: UserState.ASKED_NAME });
        }, 5000);
    } else if (state == 1) {
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
                    [{ text: ru.cat }, { text: ru.crone }, { text: ru.plane }],
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
            (ruAvatar != ru.plane && ruAvatar != ru.cat && ruAvatar != ru.crone)
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
        if (value != ru.main_menu) {
            await QuestionService.add(value, user.status - 3);
            ctx.reply(ru.success_addition);
        }
        await User.update({
            tg_id: user.tg_id,
            state: UserState.IDLE,
            status: UserStatus.ADMIN,
        });
        start(ctx, ctx.from as any);
    } else if (state == UserState.CHANGE_FIRST_NAME) {
        const { error, value } = Joi.string().required().validate(message);
        if (error) {
            return ctx.reply(ru.wrong_value);
        }
        await User.update({ tg_id, first_name: value, state: UserState.IDLE });
        await ctx.reply(ru.successful_edit);
        return start(ctx, ctx.from as any);
    } else if (state == UserState.CHANGE_LAST_NAME) {
        const { error, value } = Joi.string().required().validate(message);
        if (error) {
            return ctx.reply(ru.wrong_value);
        }
        await User.update({ tg_id, last_name: value, state: UserState.IDLE });
        await ctx.reply(ru.successful_edit);
        return start(ctx, ctx.from as any);
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
        await ctx.reply(ru.successful_edit);
        start(ctx, ctx.from as any);
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
        await ctx.reply(ru.successful_edit);
        start(ctx, ctx.from as any);
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
        await ctx.reply(ru.successful_edit);
        start(ctx, ctx.from as any);
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
        await ctx.reply(ru.successful_edit);
        start(ctx, ctx.from as any);
    } else if (state == UserState.CHANGE_NOTIFICATION_TIME) {
        const { error, value } = Joi.string()
            .regex(/\d{1,2}:\d{2}/)
            .validate(message);
        if (error) {
            return ctx.reply(ru.wrong_value);
        }
        await User.update({
            tg_id,
            notification_time: value,
            state: UserState.IDLE,
        });
        await ctx.reply(ru.successful_edit);
        start(ctx, ctx.from as any);
    } else if (state == UserState.SENDING_MEMO) {
        const { error, value } = Joi.string().required().validate(message);
        if (error) return ctx.reply(ru.get_answer);
        await QuestionService.answer(tg_id, )
        await answering(ctx.from.id, user.last_jump_cost, value);
        await User.update({ tg_id, state: UserState.IDLE, last_jump_cost: 0 });
        user = await get_user(ctx.from.id);
        if (user.last_map_id == 0) {
            User.update({ tg_id, start_energy: user.energy });
            await ctx.replyWithPhoto(config.end_game_photo);
            setTimeout(() => {
                ctx.reply(
                    ru.end_level1 +
                        user.first_name +
                        ru.end_level2 +
                        user.start_energy +
                        ru.end_level3 +
                        user.energy +
                        ru.end_level4
                );
                setTimeout(() => {
                    start(ctx);
                }, 3000);
            }, 2000);
        } else
            ctx.reply(
                ru.added_energy +
                    "\n\n\n" +
                    ru.current_status +
                    "\n" +
                    ru.energy +
                    " " +
                    user.energy +
                    "\n" +
                    ru.balance +
                    " " +
                    user.balance
            ).then((data) => {
                setTimeout(() => {
                    start(ctx);
                }, 2000);
            });
    } else if (state >= 21 && state <= 31) {
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
        await User.update({
            tg_id,
            state: state + 1,
            energy: user.energy,
        });
        if (state == 31) {
            await User.update({ tg_id, state: UserState.IDLE });
            await ctx.reply(ru.end_capital1 + user.energy + ru.end_capital2);
            return start(ctx);
        }
        let question = await get_question(tg_id, 0, state - 20);
        ctx.reply(`${state - 20}. ` + question.text, {
            reply_markup: {
                keyboard: [[{ text: ru.yes }, { text: ru.no }]],
                resize_keyboard: true,
            },
        });
    } else return next();
}
