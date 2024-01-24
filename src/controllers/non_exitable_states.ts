import Joi from "joi";
import { MyTelegraf } from "../modules/telegraf";
import { QuestionService, User } from "../services";
import { UserDto, UserState } from "../types";
import { replaceTemplateVars, ru } from "../utils";
import config from "../config";
import { start } from "./start";

export function handleNonExitableStates(bot: MyTelegraf) {
    bot.use(async (ctx, next) => {
        if (ctx.from) {
            const tg_id = ctx.from.id;
            let { user } = ctx.state as { user: UserDto };
            const state = user.state;
            const message = ctx.message
                ? (ctx.message as { text: string }).text
                : undefined;
            const from = {
                id: tg_id,
                first_name: user.first_name,
                last_name: user.last_name,
            };
            if (state == UserState.SENDING_MEMO) {
                const { error, value } = Joi.string()
                    .required()
                    .validate(message);
                if (error) return ctx.reply(ru.get_answer);
                await QuestionService.answer(tg_id, user.last_jump_cost, value);
                user = await User.get(tg_id);
                // Если пользователь прошел уровень, поздравляем его с этим
                if (user.last_map_id == 40) {
                    await User.update({ tg_id, start_energy: user.energy });
                    await ctx.replyWithPhoto(config.end_game_photo);
                    setTimeout(() => {
                        return start(
                            ctx,
                            from,
                            replaceTemplateVars(ru.end_level, {
                                first_name: user.first_name,
                                start_energy: user.start_energy,
                                energy: user.energy,
                            })
                        );
                    }, 2000);
                } else
                    ctx.reply(
                        `${ru.added_energy}\n\n\n${ru.current_status}` +
                            `\n${ru.energy} ${user.energy}` +
                            `\n${ru.balance} ${user.balance}`
                    ).then(() => {
                        setTimeout(() => {
                            start(ctx, from);
                        }, 2000);
                    });
            } else return next();
        }
    });
}
