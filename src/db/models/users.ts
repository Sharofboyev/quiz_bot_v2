import pool from "../index";
import { quest_types } from "../../utils";
import { NotFoundError } from "./errors";

export enum Avatar {
    CRONE = "crone",
    PLANE = "plane",
    CAT = "cat",
}

export type MartialStatus =
    | "Не замужем/не женат"
    | "Не хочу говорить"
    | "Замужем/женат";

export enum UserStatus {
    USER = 0,
    PLAYER = 1,
    ADMIN = 2,
}

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

export type DiaryPage = {
    level: number;
    map_id: number;
    jump: number;
    time: string;
    memo: string;
    question_text: string;
    cost: number;
};

export async function get_user(tg_id: number) {
    const { rows, rowCount } = await pool.query<
        UserDto & {
            quest_type: string;
            question: string;
            notify: string;
        }
    >(
        `
    SELECT 
        users.*,
        questions.text AS question,
        questions.type AS quest_type,
        TO_CHAR(users.notification_time + INTERVAL '3 hours', 'HH24:MI:SS') AS notify
      FROM 
        users 
      LEFT JOIN 
        turns ON users.tg_id = turns.tg_id AND turns.status
      LEFT JOIN 
        questions ON questions.id = turns.quest_id
      WHERE 
        users.tg_id = $1 
      ORDER BY 
        turns.id DESC 
      LIMIT 1;`,
        [tg_id]
    );

    if (rowCount === 0) throw new NotFoundError("User not found");
    else {
        const user = rows[0];
        user.quest_type = quest_types(Number(user.quest_type));
        return user;
    }
}

export async function add_user(user: UserDto) {
    await pool.query(
        "INSERT INTO users(tg_id, first_name, last_name) VALUES ($1, $2, $3)",
        [user.tg_id, user.first_name, user.last_name]
    );
}

export async function update_user(user: UserDto) {
    await pool.query(
        `UPDATE users 
        SET 
            first_name = COALESCE($1, first_name), 
            last_name = COALESCE($2, last_name),
            balance = COALESCE($3, balance),
            energy = COALESCE($4, energy),
            avatar = COALESCE($5, avatar), 
            state = COALESCE($6, state), 
            age = COALESCE($7, age),
            martial_status = COALESCE($8, martial_status),
            game_request = COALESCE($9, game_request),
            level = COALESCE($10, level),
            status = COALESCE($11, status),
            steps = COALESCE($12, steps),
            last_jump_cost = COALESCE($13, last_jump_cost),
            notification_time = COALESCE($14::time - INTERVAL '3 hours', notification_time),
            free_jumps = COALESCE($15, free_jumps), 
            free_jump_time = COALESCE ($16, free_jump_time),
            start_energy = COALESCE ($17, start_energy) 
        WHERE tg_id = $18`,
        [
            user.first_name,
            user.last_name,
            user.balance,
            user.energy,
            user.avatar,
            user.state,
            user.age,
            user.martial_status,
            user.game_request,
            user.level,
            user.status,
            user.steps,
            user.last_jump_cost,
            user.notification_time,
            user.free_jumps,
            user.free_jump_time,
            user.start_energy,
            user.tg_id,
        ]
    );
}

export async function get_diary(
    tg_id: TgId,
    filter: {
        limit?: number;
        offset?: number;
        order?: "ASC" | "DESC";
        level?: number;
    }
) {
    const { limit = 10, offset = 0, order = "DESC", level } = filter;
    let pages = (
        await pool.query<DiaryPage>(
            `
        SELECT 
            turns.level,
            turns.map_id,
            turns.jump,
            TO_CHAR(turns.created_time + INTERVAL '3 hours', 'YYYY-MM-DD HH24:MI:SS') AS time,
            turns.memo,
            questions.text AS question,
            questions.type AS cost
          FROM 
            turns 
          LEFT JOIN 
            questions ON turns.quest_id = questions.id 
          WHERE 
            turns.tg_id = $1 
            AND turns.status 
            AND turns.quest_id NOT IN (SELECT id FROM questions WHERE type = 0) 
            AND (COALESCE($2, turns.level) = turns.level)
          ORDER BY 
            turns.id ${order}
          LIMIT $3 OFFSET $4;`,
            [tg_id, level, limit, offset]
        )
    ).rows;
    return pages;
}
