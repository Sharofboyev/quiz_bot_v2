import { Telegraf } from "telegraf";
import { User } from "./services/user";
import { replaceTemplateVars } from "./utils/index";
import { ru } from "./utils/lang";
import config from "./config";

User.get(346686979)
    .then((user) => {
        const bot = new Telegraf(config.token);
        const message = replaceTemplateVars(ru.end_level, user);
        bot.telegram.sendMessage(user.tg_id, message);
    })
    .catch((err) => console.log(err));
