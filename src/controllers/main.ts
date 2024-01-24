import { MyTelegraf } from "../modules/telegraf";
import { User, QuestionService } from "../services";
import { QuestType, AnswerType, mainMenuButton, UserDto } from "../types";
import config from "../config";
import { ru } from "../utils";
import { start } from "./start";
import {
    convertQuestTypeToAnswerType,
    prepareTextForChosenQuestion,
    prepareTextForTakingRest,
} from "../utils";
import { TgId, UserState } from "../types";

export function listenMainEvents(bot: MyTelegraf) {
    // This controller used for handling question pick and rest pick events on pause cells
    bot.action(/get_\w+/, async (ctx) => {
        ctx.editMessageReplyMarkup(undefined);
        const tg_id: TgId = ctx.callbackQuery.from.id;
        if (!ctx.callbackQuery || !ctx.callbackQuery.message) return;
        if (
            new Date(ctx.callbackQuery.message.date * 1000) <
            new Date(Number(new Date()) - 2 * 3600 * 1000)
        ) {
            await User.update({
                tg_id,
                last_jump_cost: 0,
            });
            return ctx.reply(ru.late).then(() => {
                start(ctx, ctx.callbackQuery.from);
            });
        }
        if (!("data" in ctx.callbackQuery)) return; // Just type narrowing here
        let data = ctx.callbackQuery.data.substring(4);
        let cost = 0;
        switch (data) {
            case "exercise":
                cost -= 2;
            case "question":
                cost -= 1;
                const questionType: QuestType = -cost;
                let question = await QuestionService.get_new_question({
                    tg_id,
                    type: questionType,
                });
                const inline_keyboard = [
                    [
                        {
                            text: ru.completed,
                            callback_data: `set_${questionType}completed`,
                        },
                        {
                            text: ru.incompleted,
                            callback_data: `set_${questionType}incompleted`,
                        },
                    ],
                ];
                await User.update({ tg_id, last_jump_cost: -questionType });
                ctx.reply(prepareTextForChosenQuestion(question), {
                    reply_markup: { inline_keyboard },
                });
                break;
            case "rest":
                let user = ctx.state.user;
                // Если пользователь прошел уровень, поздравляем его с этим
                if (user.last_map_id == 40) {
                    await User.update({ tg_id, start_energy: user.energy });
                    await ctx.replyWithPhoto(config.end_game_photo);
                    setTimeout(async () => {
                        await ctx.reply(prepareTextForTakingRest(user));
                        setTimeout(async () => {
                            await start(ctx, ctx.callbackQuery.from);
                        }, 3000);
                    }, 2000);
                } else await ctx.reply(ru.having_rest);
        }
    });

    bot.action(/set_\w+/, async (ctx) => {
        ctx.editMessageReplyMarkup(undefined);
        if (!("data" in ctx.callbackQuery)) return; // Just type narrowing here

        const tg_id: TgId = ctx.callbackQuery.from.id;
        let { user } = ctx.state as { user: UserDto };

        // Parsing callback data to get type of question and intention of user
        const regex = /set_(\d{1})(completed|incompleted|come_back)$/;
        const match = ctx.callbackQuery.data.match(regex);
        if (!match) return ctx.reply(ru.no_such_keyboard);
        let type: QuestType = parseInt(match[1]);
        let data = match[2];

        if (data == "completed") {
            await User.update({
                tg_id,
                state: UserState.SENDING_MEMO,
                last_jump_cost: type,
            });
            return ctx.reply(ru.get_answer);
        } else if (data == "incompleted") {
            if (user.last_jump_cost < 0) {
                // This means, last cell was type of Pause
                await QuestionService.answer(
                    tg_id,
                    convertQuestTypeToAnswerType(QuestType.PAUSE, false)
                );
                await ctx.reply(ru.removed_energy);
            } else {
                await QuestionService.answer(
                    tg_id,
                    convertQuestTypeToAnswerType(type, false)
                );
                await ctx.reply(ru.removed_energy);
            }
        } else if (data == "come_back") {
            await QuestionService.answer(tg_id, AnswerType.CANCEL_JUMP);
            await ctx.reply(ru.came_back);
        }
        await User.update({ tg_id, state: UserState.IDLE, last_jump_cost: 0 });
        setTimeout(() => {
            return start(ctx, ctx.callbackQuery.from);
        }, 2000);
    });

    bot.hears(ru.credits, async (ctx) => {
        await ctx.replyWithPhoto(ru.author_photo).then(() => {
            setTimeout(() => {
                ctx.reply(ru.founders);
            }, 1500);
        });
    });

    bot.hears(ru.rules, async (ctx) => {
        return await ctx.replyWithDocument(config.rulesFileId);
    });

    bot.hears(ru.main_menu, (ctx) => {
        return start(ctx, ctx.from);
    });

    bot.hears(ru.payment, async (ctx) => {
        ctx.replyWithInvoice({
            currency: "RUB",
            description: ru.payment_description,
            payload: "payment_for_game",
            title: ru.payment_title,
            provider_token: config.live_pay,
            prices: [{ amount: 10000, label: ru.payment_minimum }],
            max_tip_amount: 1000000,
            suggested_tip_amounts: [50000, 90000, 290000],
            photo_height: 800,
            photo_width: 800,
            photo_url: config.pic_dice,
        });
    });

    bot.hears(ru.coupon, async (ctx) => {
        await User.update({
            tg_id: ctx.from.id,
            state: UserState.ACTIVATING_COUPON,
        });
        return ctx.reply(ru.send_coupon, {
            reply_markup: { keyboard: mainMenuButton },
        });
    });
}
