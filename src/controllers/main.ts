import { MyTelegraf } from "../db/models/telegraf";
import { Track } from "../services/track";
import { User, Map, QuestionService, QuestType } from "../services";
import config from "../config";
import moment from "moment";
import ru from "../utils/ru";
import { start } from "./start";
import {
    getQuestName,
    prepareTextForChosenQuestion,
    prepareTextForTakingRest,
} from "../utils";

export function listenMainEvents(bot: MyTelegraf) {
    bot.use((ctx, next) => {
        if (ctx.from) {
            Track.add(
                ctx.message || ctx.callbackQuery || ctx.preCheckoutQuery,
                ctx.from.id
            );
        }
        return next();
    });

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

    bot.action(/get_\w+/, async (ctx) => {
        ctx.editMessageReplyMarkup(undefined);
        const tg_id = ctx.callbackQuery.from.id;
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
                start(ctx, tg_id);
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
                let question = await QuestionService.get({
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
                    setTimeout(() => {
                        ctx.reply(prepareTextForTakingRest(user));
                        setTimeout(() => {
                            start(ctx, tg_id);
                        }, 3000);
                    }, 2000);
                } else ctx.reply(ru.having_rest);
        }
    });
}
