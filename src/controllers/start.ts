import { CustomContext, MyTelegraf } from "../modules/telegraf";
import { User } from "../services";
import { ru } from "../utils";

export function listenStart(bot: MyTelegraf) {
    bot.start(async (ctx) => {
        return start(ctx, ctx.from);
    });
}

export async function start(
    ctx: CustomContext,
    from: { id: number; first_name: string; last_name?: string }
) {
    const tg_id = from.id;
    console.log(tg_id);
    let user = await User.get(tg_id);
    if (!user) {
        await User.add({ ...from, tg_id });
        user = await User.get(tg_id);
    }
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
