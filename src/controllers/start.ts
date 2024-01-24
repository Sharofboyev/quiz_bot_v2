import { CustomContext, MyTelegraf } from "../modules/telegraf";
import { User } from "../services";
import { UserDto } from "../types";
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
    let { user } = ctx.state as { user: UserDto };
    if (!user) {
        await User.add({ ...from, tg_id });
        user = await User.get(tg_id);
    }
    let keyboard = [
        [{ text: ru.dice }, { text: ru.map }],
        [{ text: ru.diary }, { text: ru.settings }],
        [{ text: ru.rules }, { text: ru.coupon }],
        [{ text: ru.payment }, { text: ru.credits }],
    ];
    if (User.is_admin(user)) {
        keyboard[2] = [{ text: ru.add_question }, { text: ru.generate_coupon }];
    }

    ctx.reply(ru.start, {
        reply_markup: {
            keyboard,
        },
    });
}
