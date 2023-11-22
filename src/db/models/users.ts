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

export type User = {
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

export async function get_user(tg_id: number) {
    const { rows, rowCount } = await pool.query(
        `
  SELECT u.*, t.text AS question, t.type AS quest_type, TO_CHAR(notification_time + INTERVAL '3 hours', 'HH24:MI:SS') AS notify FROM users u 
  LEFT JOIN (SELECT * FROM turns JOIN questions q ON q.id = turns.quest_id WHERE status AND tg_id = $1 ORDER BY turns.created_time DESC LIMIT 1) t 
  ON u.tg_id = t.tg_id WHERE u.tg_id = $1`,
        [tg_id]
    );

    if (rowCount === 0) throw new NotFoundError("User not found");
    else {
        const user = rows[0] as User & {
            quest_type: string;
            question: string;
            notify: string;
        };
        user.quest_type = quest_types(Number(user.quest_type));
        return user;
    }
}

export async function add_user(user: User) {
    await pool.query(
        "INSERT INTO users(tg_id, first_name, last_name) VALUES ($1, $2, $3)",
        [user.tg_id, user.first_name, user.last_name]
    );
}

export async function update_user(user: User) {
    await pool.query(
        `UPDATE users SET 
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
      free_jumps = COALESCE($15, free_jumps), free_jump_time = COALESCE ($16, free_jump_time),
      start_energy = COALESCE ($17, start_energy)  WHERE tg_id = $18`,
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
