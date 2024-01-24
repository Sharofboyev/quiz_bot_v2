import pool from "../index";
import { getQuestName } from "../../utils";
import { NotFoundError, UserNotFoundError } from "./errors";
import {
    UserDto,
    UpdateUserDto,
    DiaryPage,
    TgId,
    AddUserDto,
    CellType,
} from "../../types";

export async function get_user(tg_id: number) {
    const { rows, rowCount } = await pool.query<
        UserDto & {
            cell_type: CellType;
            question: string;
            notify: string;
        }
    >(
        `
    SELECT 
        users.*,
        questions.text AS question,
        questions.type AS cell_type,
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

    if (rowCount === 0) throw new UserNotFoundError();
    else {
        const user = rows[0];
        user.cell_type = getQuestName(Number(user.cell_type));
        return user;
    }
}

export async function add_user(user: AddUserDto) {
    await pool.query(
        "INSERT INTO users(tg_id, first_name, last_name) VALUES ($1, $2, $3)",
        [user.tg_id, user.first_name, user.last_name]
    );
}

export async function update_user(user: UpdateUserDto) {
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
            start_energy = COALESCE ($17, start_energy),
            free_level = COALESCE ($18, free_level)
        WHERE tg_id = $19`,
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
            user.free_level,
            user.tg_id,
        ]
    );
}

export async function get_diary(
    tg_id: TgId,
    filter?: {
        limit?: number;
        offset?: number;
        order?: "ASC" | "DESC";
        level?: number;
    }
) {
    if (!filter) filter = {};
    const { limit = 10, offset = 0, order = "DESC" } = filter;

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
          ORDER BY 
            turns.id ${order}`,
            [tg_id]
        )
    ).rows;

    // todo: add pagination and filter by level
    return pages;
}
