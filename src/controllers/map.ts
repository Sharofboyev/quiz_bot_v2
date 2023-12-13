import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import config from "../config";
import { MyTelegraf } from "../modules/telegraf";
import { Map, QuestionService, User } from "../services";
import { Avatar } from "../types";
import { ru, upperFirstLetter } from "../utils";

export function controlMapInteractions(bot: MyTelegraf) {
    bot.hears(ru.map, async (ctx) => {
        const user = await User.get(ctx.from.id);
        let { tg_id, cell_type, avatar, steps, last_map_id, level } = user;
        let message = "";
        if (!avatar || steps == 0) {
            avatar = Avatar.MAP;
            message = `${upperFirstLetter(ru.map_id)}: ${last_map_id}\n\n`;
        }

        const question = await QuestionService.getLastQuestion(tg_id);
        if (!question) {
        } else {
            message +=
                ru.cell_type +
                ": " +
                cell_type +
                "\n" +
                upperFirstLetter(ru.map_id) +
                ": " +
                last_map_id +
                "\n\n" +
                question.text;
        }

        const image = await Map.get_image(last_map_id, avatar, level);
        await ctx.replyWithPhoto(image, {
            caption: message,
        });
    });

    bot.hears(ru.dice, async (ctx) => {
        let user = await User.get(ctx.from.id);
        const { can_jump, error, jump } = await Map.jump({
            tg_id: ctx.from.id,
            jump: 1,
        });
        if (!can_jump) return ctx.reply(error as string);

        if (ctx.from.id != config.owner) {
            return ctx.reply(ru.jumps_limited);
        }
        if (
            user.free_jumps <= 0 &&
            user.balance < 100 &&
            user.free_jump_time < new Date()
        ) {
            return ctx.reply(ru.no_free_jumps);
        }
        ctx.replyWithDice().then(async (data) => {
            let new_turn = await Map.jump({
                tg_id: ctx.from.id,
                jump: data.dice.value,
            });
            if (new_turn.error) console.log(new_turn.error);
            if (!new_turn.can_jump) {
                return ctx.reply(new_turn.error as string);
            }
            setTimeout(async () => {
                let keyboard: InlineKeyboardButton[][];
                let id = new_turn.jump.;
                if ([1, 2, 3].includes(id)) {
                    keyboard = [
                        [
                            {
                                text: ru.completed,
                                callback_data: `set_${id}completed`,
                            },
                            {
                                text: ru.incompleted,
                                callback_data: `set_${id}incompleted`,
                            },
                        ],
                        [
                            {
                                text: ru.come_back,
                                callback_data: `set_${id}come_back`,
                            },
                        ],
                    ];
                } else {
                    keyboard = [
                        [
                            { text: ru.get_rest, callback_data: "get_rest" },
                            {
                                text: ru.get_question,
                                callback_data: "get_question",
                            },
                        ],
                        [
                            {
                                text: ru.get_exercise,
                                callback_data: "get_exercise",
                            },
                        ],
                    ];
                }
                await ctx.replyWithPhoto(new_turn.map);
                return ctx.reply(
                    ru.dice_value +
                        " " +
                        data.dice.value +
                        ".\n" +
                        ru.cell_type +
                        ": " +
                        new_turn.quest_type +
                        "\n" +
                        ru.map_id.substr(0, 1).toUpperCase() +
                        ru.map_id.substr(1) +
                        ": " +
                        new_turn.map_id +
                        "\n\n " +
                        new_turn.question +
                        "\n\n___________________\n" +
                        ru[`note${new_turn.quest_type_id}`],
                    { reply_markup: { inline_keyboard: keyboard } }
                );
            }, 5000);
        });
    });
}
