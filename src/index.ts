import { MyTelegraf, CustomContext } from "./modules/telegraf";
import config from "./config";
import {
    listenMainEvents,
    listenPayments,
    listenStart,
    listenStates,
    trackBot,
    listenUserEvents,
} from "./controllers";

const bot = new MyTelegraf(config.token, {
    contextType: CustomContext,
});

trackBot(bot);
listenPayments(bot);
listenMainEvents(bot);
listenStart(bot);
listenStates(bot);
listenUserEvents(bot);

bot.launch();
