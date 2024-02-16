import {
    Avatar,
    CouponType,
    JumpType,
    Language,
    QuestType,
    UserStatus,
} from "./constants";

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
    free_level?: number;
    language: Language;
};

export type UpdateUserDto = Partial<UserDto> & {
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

export type GetNewQuestionDto = {
    tg_id: number;
    type: QuestType;
    blitz_question_id?: number;
};

export type AssignQuestionDto = {
    tg_id: number;
    level: number;
    question_id: number;
    map_id: number;
    jump: number;
};

export type Question = {
    id: number;
    text: string;
    type: QuestType;
    created_time: Date;
};

export type Jump = {
    jump_type: JumpType;
    map_id: number;
    level: number;
    image: string;
    qustion_type: QuestType;
    question_text: string;
};

export type CanJumpDto = {
    can_jump: boolean;
    error?: string;
    jump_type?: JumpType;
};

export type JumpDto = {
    jump: number;
    user: UserDto;
    jump_type: JumpType;
};

export type MapCell = {
    image: string;
    questType: QuestType;
};

export type LastJump = {
    map_id: number;
    jump: number;
    quest_id: number;
    created_time: Date;
    status: boolean;
    level: number;
    can_jump: boolean;
};

export type Coupon = {
    id: number;
    code: string;
    type: CouponType;
    created_time: Date;
    tg_id?: number;
    activated_time?: Date;
    used: boolean;
};

export type LanguageModel = {
    welcome: string;
    get_name: string;
    get_age: string;
    get_martial_status: string;
    martial_statuses: string[];
    request_to_game: string;
    yes: string;
    no: string;
    start: string;
    dice: string;
    map: string;
    settings: string;
    change_lang: string;
    main_menu: string;
    back: string;
    choose_avatar: string;
    plane: string;
    crone: string;
    cat: string;
    first_name: string;
    last_name: string;
    balance: string;
    energy: string;
    avatar: string;
    martial_status: string;
    game_request: string;
    level: string;
    steps: string;
    diary: string;
    none: string;
    edit: string;
    age: string;
    year: string;
    on_error: string;
    notification_time: string;
    ask_edit: string;
    wrong_value: string;
    successful_edit: string;
    jumps_limited: string;
    question: string;
    exercise: string;
    thankful: string;
    pause: string;
    cell_type: string;
    dice_value: string;
    completed: string;
    incompleted: string;
    come_back: string;
    get_rest: string;
    get_question: string;
    get_exercise: string;
    note1: string;
    note2: string;
    note3: string;
    note4: string;
    note5: string;
    you_have_chosen: string;
    added_energy: string;
    removed_energy: string;
    came_back: string;
    get_answer: string;
    late: string;
    having_rest: string;
    no_such_keyboard: string;
    current_map_id: string;
    rules: string;
    credits: string;
    payment: string;
    founders: string;
    map_id: string;
    time: string;
    answer: string;
    no_more: string;
    undefined: string;
    not_answered: string;
    not_found: string;
    add_question: string;
    game_rule: string;
    pay: string;
    question_types: string;
    send_question: string;
    success_addition: string;
    capital_question: string;
    game_capital: string;
    capital_start: string;
    your_steps: string;
    choose_what: string;
    no_free_jumps: string;
    change_last_name: string;
    payment_description: string;
    payment_title: string;
    payment_minimum: string;
    end_capital: string;
    current_status: string;
    author_photo: string;
    end_level: string;
    free_jumps: string;
    free_jump_time: string;
    blits: string;
    end: string;
    no_more_questions: string;
    notification_text: string;
    decreased_energy: string;
    decreased_energy1: string;
    decreased_energy2: string;
    no_more_level: string;
    coupon: string;
    coupon_not_found: string;
    coupon_allowed_only_once: string;
    coupon_activated: string;
    send_coupon: string;
    generate_coupon: string;
    coupon_types: string;
    coupon_free_jump: string;
    coupon_free_level: string;
    coupon_generated: string;
    wrong_notification_time: string;
};
