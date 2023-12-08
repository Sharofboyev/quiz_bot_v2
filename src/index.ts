import { MyTelegraf, CustomContext, MyTelegram } from "./db/models/telegraf";

import { listenMainEvents } from "./controllers/main";
import config from "./config";
import { listenStart } from "./controllers/start";

const bot = new MyTelegraf(config.token, {
    contextType: CustomContext,
});

listenMainEvents(bot);
listenStart(bot);

bot.launch();
