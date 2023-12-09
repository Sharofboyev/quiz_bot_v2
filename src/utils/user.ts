import { ru } from "./lang";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Avatar, DiaryPage, UserDto } from "../types";
import moment from "moment";

export function sender_diary(
    index: number,
    pages: DiaryPage[],
    cb: (data: { message: string; keyboard: InlineKeyboardButton[][] }) => void
) {
    const amount = pages.length - index;
    const end = Math.min(index + 9, pages.length);

    const message = buildMessage(index, end, pages);
    const keyboard = buildKeyboard(index, end, pages);

    return cb({ message, keyboard });
}

function buildMessage(index: number, end: number, pages: DiaryPage[]) {
    let message = `${index}-${end} из ${pages.length}\n`;

    for (let i = index - 1; i < end; i++) {
        message += `\n${i + 2 - index}. ${ru.level}: ${pages[i].level}\n${
            ru.map_id
        }: ${pages[i].map_id}\n${ru.time}: ${pages[i].time}`;
    }

    return message;
}

function buildKeyboard(index: number, end: number, pages: DiaryPage[]) {
    const keyboard: InlineKeyboardButton[][] = [];
    const buttonsPerRow = Math.ceil((end - index) / 2);

    let currentRow: InlineKeyboardButton[] = [];
    for (let i = index - 1; i < end; i++) {
        const text = String(i + 2 - index);
        const callbackData = `diary#_#${i}`;

        currentRow.push({ text, callback_data: callbackData });

        if (currentRow.length === buttonsPerRow) {
            keyboard.push(currentRow);
            currentRow = [];
        }
    }

    if (currentRow.length > 0) {
        keyboard.push(currentRow);
    }

    keyboard.push([
        { text: "⬅️", callback_data: `prev${index > 10 ? index - 10 : "not"}` },
        {
            text: "➡️",
            callback_data: `next${end == pages.length ? "not" : index + 10}`,
        },
    ]);

    return keyboard;
}

export function prepareUserInfo(user: UserDto) {
    let message = ru.diary + "\n";
    message += ru.first_name + ": " + user.first_name + "\n";
    message +=
        ru.last_name +
        ": " +
        (user.last_name ? user.last_name : ru.undefined) +
        "\n";
    message +=
        ru.age + ": " + user.age + " " + getRussianAgePostfix(user.age) + "\n";
    message += ru.martial_status + ": " + user.martial_status + "\n";
    message +=
        ru.avatar + ": " + (user.avatar ? ru[user.avatar] : ru.none) + "\n";
    message +=
        ru.game_request +
        ": " +
        (user.game_request ? user.game_request : ru.none) +
        "\n";
    message += ru.balance + ": " + user.balance + "\n";
    message += ru.energy + ": " + user.energy + "\n";
    message += ru.free_jumps + ": " + user.free_jumps + "\n";
    if (user.free_jump_time > new Date()) {
        message +=
            ru.free_jump_time +
            ": " +
            moment(user.free_jump_time).format("YYYY-MM-DD") +
            "\n";
    }
    message += ru.current_map_id + ": " + user.last_map_id + "\n";
    message += ru.level + ": " + user.level + "\n";
    message += ru.steps + ": " + user.steps + "\n";
    message += ru.notification_time + ": " + user.notification_time + "\n";

    return message;
}

function getRussianAgePostfix(age: number) {
    age = age % 100;
    if (age > 10 && age < 15) return "лет";
    if (age % 10 == 1) return "год";
    if (age % 10 > 1 && age % 10 < 5) return "года";
    return "лет";
}