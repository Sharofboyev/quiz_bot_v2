export enum JumpType {
    FREE_JUMP_TIME = "free_jump_time",
    FREE_JUMPS = "free_jumps",
    BALANCE = "balance",
}

export enum Avatar {
    CRONE = "crone",
    PLANE = "plane",
    CAT = "cat",
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
