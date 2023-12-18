import { MyTelegraf } from "../modules/telegraf";
import { User, QuestionService } from "../services";
import { QuestType, AnswerType } from "../types";
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
                cost -= 5;
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
                await User.update({ tg_id, last_jump_cost: cost });
                ctx.reply(prepareTextForChosenQuestion(question), {
                    reply_markup: { inline_keyboard },
                });
                break;
            case "rest":
                let user = await User.get(tg_id);
                if (user.last_map_id == 0 && user.level > 1) {
                    User.update({ tg_id, start_energy: user.energy });
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
        let user = await User.get(tg_id);

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

    bot.hears(ru.add_question, async (ctx, next) => {
        let user = await User.get(ctx.from.id);
        if (User.is_admin(user))
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
        else return next();
    });

    bot.hears(ru.main_menu, (ctx) => {
        return start(ctx, ctx.from);
    });
}
