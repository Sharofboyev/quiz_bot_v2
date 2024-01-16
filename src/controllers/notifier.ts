import { CronJob } from "cron";
import { MyTelegraf } from "../modules/telegraf";
import { Notify } from "../services";
import { ru } from "../utils";
export async function notify(bot: MyTelegraf) {
    const job = new CronJob(
        "00 * * * * *",
        async function () {
            let users = await Notify.notify(bot);
            if (!users) {
                return;
            }
            for (let i = 0; i < users.length; i++) {
                bot.telegram.sendMessage(users[i].tg_id, ru.notification_text);
            }
        },
        null,
        true,
        "Europe/Moscow"
    );
    job.start();
}
