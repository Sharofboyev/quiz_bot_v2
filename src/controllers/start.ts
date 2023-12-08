import { CustomContext, MyTelegraf } from "../db/models/telegraf";
import { User } from "../services";
import ru from "../utils/ru";

export function listenStart(bot: MyTelegraf) {
    bot.start(async (ctx) => {
        return start(ctx, ctx.from.id);
    });
}

export async function start(ctx: CustomContext, tg_id: number) {
    console.log(tg_id);
    let user = await User.get(tg_id);
    let keyboard = [
        [{ text: ru.dice }, { text: ru.map }],
        [{ text: ru.diary }, { text: ru.settings }],
        [{ text: ru.rules }],
        [{ text: ru.payment }, { text: ru.credits }],
    ];
    if (User.is_admin(user)) {
        keyboard[2] = [{ text: ru.add_question }];
    }

    ctx.reply(ru.start, {
        reply_markup: {
            inline_keyboard: [
                [{ text: ru.change_lang, callback_data: "change_lang" }],
            ],
        },
    });
}
