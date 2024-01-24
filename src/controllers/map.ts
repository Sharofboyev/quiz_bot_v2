import { MyTelegraf } from "../modules/telegraf";
import { Map, QuestionService, User } from "../services";
import { Avatar, CellType, JumpType, UserDto } from "../types";
import {
    prepareAnswerKeyboard,
    prepareJumpText,
    ru,
    upperFirstLetter,
} from "../utils";
import { QuestionNotFoundError } from "../db/models/errors";

export function controlMapInteractions(bot: MyTelegraf) {
    bot.hears(ru.map, async (ctx) => {
        const { user } = ctx.state as {
            user: UserDto & { cell_type: CellType };
        };
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

        const cell = await Map.get_cell_info(last_map_id, avatar, level);
        await ctx.replyWithPhoto(cell.image, {
            caption: message,
        });
    });

    bot.hears(ru.dice, async (ctx) => {
        let { user } = ctx.state;

        const { can_jump, error, jump_type } = await Map.canJump(
            user.tg_id,
            user
        );
        if (!can_jump) {
            return ctx.reply(error as string);
        }
        ctx.replyWithDice().then(async (data) => {
            try {
                let jump = await Map.jump({
                    user: user,
                    jump: data.dice.value,
                    jump_type: jump_type as JumpType,
                });

                setTimeout(async () => {
                    const keyboard = prepareAnswerKeyboard(jump.qustion_type);
                    await ctx.replyWithPhoto(jump.image);

                    const message = prepareJumpText(
                        user,
                        jump,
                        data.dice.value
                    );
                    return ctx.reply(message, {
                        reply_markup: { inline_keyboard: keyboard },
                    });
                }, 5000);
            } catch (err) {
                if (err instanceof QuestionNotFoundError) {
                    return ctx.reply(ru.no_more_questions);
                }
            }
        });
    });
}
