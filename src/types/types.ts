import { Avatar, UserStatus } from "./constants";

export type MartialStatus =
    | "Не замужем/не женат"
    | "Не хочу говорить"
    | "Замужем/женат";

export type TgId = number;

export type UserDto = {
    id: number;
    first_name: string;
    last_name: string;
    tg_id: number;
    balance: number;
    energy: number;
    avatar: Avatar;
    age: number;
    martial_status?: MartialStatus | null;
    game_request?: string | null;
    level: number;
    steps: number;
    state: number;
    last_map_id: number;
    last_jump: number;
    last_jump_time?: Date;
    last_jump_cost: number;
    status: UserStatus;
    notification_time?: string;
    created_time: Date;
    free_jumps: number;
    free_jump_time: Date;
    start_energy: number;
    notified: boolean;
};

export type UpdateUserDto = {
    first_name?: string;
    last_name?: string;
    balance?: number;
    energy?: number;
    avatar?: Avatar;
    age?: number;
    martial_status?: MartialStatus | null;
    game_request?: string | null;
    level?: number;
    steps?: number;
    state?: number;
    last_map_id?: number;
    last_jump?: number;
    last_jump_time?: Date;
    last_jump_cost?: number;
    status?: UserStatus;
    notification_time?: string;
    free_jumps?: number;
    free_jump_time?: Date;
    start_energy?: number;
    notified?: boolean;
    tg_id: number;
};

export type AddUserDto = {
    tg_id: number;
    first_name: string;
    last_name?: string;
};

export type DiaryPage = {
    level: number;
    map_id: number;
    jump: number;
    time: string;
    memo: string;
    question_text: string;
    cost: number;
};
