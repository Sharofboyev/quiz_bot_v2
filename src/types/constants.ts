import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { ru } from "../utils";

export enum JumpType {
    FREE_JUMP_TIME = "free_jump_time",
    FREE_JUMPS = "free_jumps",
    FREE_LEVEL = "free_level",
    BALANCE = "balance",
}

export enum Avatar {
    CRONE = "crone",
    PLANE = "plane",
    CAT = "cat",
    MAP = "map",
    AVATARS = "avatar",
}

export const changeUser = [
    "first_name",
    "last_name",
    "age",
    "martial_status",
    "game_request",
    "avatar",
    "notification_time",
];

export enum UserState {
    NEW_USER = 0,
    ASKED_NAME = 1,
    ASKED_AGE = 2,
    ASKED_MARTIAL_STATUS = 3,
    ASKED_GAME_REQUEST = 4,
    ASKED_TO_CHOOSE_AVATAR = 5,
    IDLE = 6,
    ADDING_BLITZ = 7,
    ADDING_QUESTION = 8,
    ADDING_THANKFUL = 9,
    ADDING_EXERCICE = 10,
    SENDING_MEMO = 11,
    ACTIVATING_COUPON = 12,
    CAPITAL_START = 22,
    CAPITAL_LOWER_LIMIT = 21,
    CAPITAL_UPPER_LIMIT = 31,
    CHANGE_FIRST_NAME = -1,
    CHANGE_LAST_NAME = -2,
    CHANGE_AGE = -3,
    CHANGE_MARTIAL_STATUS = -4,
    CHANGE_GAME_REQUEST = -5,
    CHANGE_AVATAR = -6,
    CHANGE_NOTIFICATION_TIME = -7,
}

export enum UserStatus {
    NEW_USER = 0,
    PLAYER = 1,
    ADMIN = 2,
}

export enum QuestType {
    BLITZ = 0,
    QUESTION = 1,
    THANKFUL = 2,
    EXERCISE = 3,
    PAUSE = 4,
    END = 5,
}

export enum AnswerType {
    CANCEL_JUMP = 0,
    ANSWER_BLITZ = 1,
    ANSWER_QUESTION = 1,
    ANSWER_THANKFUL = 2,
    ANSWER_EXERCISE = 3,
    NOT_ANSWER_BLITZ = 0,
    NOT_ANSWER_QUESTION = -1,
    NOT_ANSWER_THANKFUL = -2,
    NOT_ANSWER_EXERCISE = -3,
    NOT_ANSWER_PAUSE = -4,
}

export enum CellType {
    BLITZ = "Блиц-вопрос",
    QUESTION = "Вопрос",
    EXERCISE = "Задание",
    THANKFUL = "Благодарность",
    PAUSE = "Пауза",
    END = "Конец",
}

export enum CouponType {
    FREE_JUMP = "free_jump",
    FREE_LEVEL = "free_level",
}

export const mainMenuButton: KeyboardButton[][] = [[{ text: ru.main_menu }]];
