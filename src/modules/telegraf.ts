import { Context, Telegraf, Telegram } from "telegraf";
import {
    ExtraReplyMessage,
    NewInvoiceParameters,
    ExtraInvoice,
    ExtraPhoto,
} from "telegraf/typings/telegram-types";
import * as tg from "telegraf/typings/core/types/typegram";
import { FmtString } from "telegraf/typings/format";
import { Track } from "../services/track";

export class CustomContext extends Context {
    async reply(
        text: string | FmtString,
        extra?: ExtraReplyMessage
    ): Promise<tg.Message.TextMessage> {
        const resp = await super.reply(text, extra);
        Track.add(resp, 0);
        return resp;
    }

    async replyWithPhoto(
        photo: tg.InputFile,
        extra?: ExtraReplyMessage
    ): Promise<tg.Message.PhotoMessage> {
        const resp = await super.replyWithPhoto(photo, extra);
        Track.add(resp, 0);
        return resp;
    }

    async replyWithDice(
        extra?: ExtraReplyMessage
    ): Promise<tg.Message.DiceMessage> {
        const resp = await super.replyWithDice(extra);
        Track.add(resp, 0);
        return resp;
    }

    async replyWithDocument(
        document: tg.InputFile,
        extra?: ExtraReplyMessage
    ): Promise<tg.Message.DocumentMessage> {
        const resp = await super.replyWithDocument(document, extra);
        Track.add(resp, 0);
        return resp;
    }

    async replyWithInvoice(
        invoice: NewInvoiceParameters,
        extra?: ExtraInvoice
    ): Promise<tg.Message.InvoiceMessage> {
        const resp = await super.replyWithInvoice(invoice, extra);
        Track.add(resp, 0);
        return resp;
    }
}

export class MyTelegram extends Telegram {
    async sendMessage(
        chat_id: number | string,
        text: string | FmtString,
        extra?: ExtraReplyMessage
    ) {
        const resp = await super.sendMessage(chat_id, text, extra);
        Track.add(resp, 0);
        return resp;
    }

    async sendPhoto(
        chat_id: number | string,
        photo: tg.Opts<"sendPhoto">["photo"],
        extra?: ExtraPhoto
    ) {
        const resp = await super.sendPhoto(chat_id, photo, extra);
        Track.add(resp, 0);
        return resp;
    }
}

export class MyTelegraf extends Telegraf<CustomContext> {
    public telegram: MyTelegram;
    constructor(token: string, options?: any) {
        super(token, options);
        this.telegram = new MyTelegram(token, options);
    }
}
