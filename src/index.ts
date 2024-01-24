import { MyTelegraf, CustomContext } from "./modules/telegraf";
import config from "./config";
import {
    listenAdminEvents,
    listenPayments,
    listenStart,
    trackBot,
    listenUserEvents,
    controlMapInteractions,
    handleError,
    states,
    handleNonExitableStates,
    notify,
    listenMainEvents,
} from "./controllers";

const bot = new MyTelegraf(config.token, {
    contextType: CustomContext,
});

trackBot(bot);
listenPayments(bot);
handleNonExitableStates(bot);
states(bot);
listenAdminEvents(bot);
listenMainEvents(bot);
listenStart(bot);
listenUserEvents(bot);
controlMapInteractions(bot);
notify(bot);
handleError(bot);

bot.launch();
