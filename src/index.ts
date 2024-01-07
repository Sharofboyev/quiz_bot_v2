import { MyTelegraf, CustomContext } from "./modules/telegraf";
import config from "./config";
import {
    listenMainEvents,
    listenPayments,
    listenStart,
    trackBot,
    listenUserEvents,
    controlMapInteractions,
    handleError,
    states,
} from "./controllers";

const bot = new MyTelegraf(config.token, {
    contextType: CustomContext,
});

trackBot(bot);
listenPayments(bot);
states(bot);
listenMainEvents(bot);
listenStart(bot);
listenUserEvents(bot);
controlMapInteractions(bot);
handleError(bot);

bot.launch();
