import { ru } from "../utils";

export enum JumpType {
    FREE_JUMP_TIME = "free_jump_time",
    FREE_JUMPS = "free_jumps",
    BALANCE = "balance",
}

export enum Avatar {
    CRONE = "crone",
    PLANE = "plane",
    CAT = "cat",
    MAP = "map",
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
    IDLE = 6,
    SENDING_MEMO = 11,
    CHANGE_FIRST_NAME = -1,
    CHANGE_LAST_NAME = -2,
    CHANGE_AGE = -3,
    CHANGE_MARTIAL_STATUS = -4,
    CHANGE_GAME_REQUEST = -5,
    CHANGE_AVATAR = -6,
    CHANGE_NOTIFICATION_TIME = -7,
}

export enum UserStatus {
    USER = 0,
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
