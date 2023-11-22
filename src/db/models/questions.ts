import pool from "../index";

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
    ANSWER_QUESTION = 1,
    ANSWER_THANKFUL = 2,
    ANSWER_EXERCISE = 3,
    NOT_ANSWER_QUESTION = -1,
    NOT_ANSWER_THANKFUL = -2,
    NOT_ANSWER_EXERCISE = -3,
    NOT_ANSWER_PAUSE = -4,
}

export async function answer(tg_id: number, type: AnswerType, answer?: string) {
    if (type == 0) {
        await pool.query(
            "UPDATE users SET last_map_id = last_map_id - last_jump WHERE tg_id = $1",
            [tg_id]
        );
        await pool.query(
            "UPDATE turns SET status = FALSE WHERE id IN (SELECT id FROM turns WHERE tg_id = $1 AND status ORDER BY created_time DESC LIMIT 1)",
            [tg_id]
        );
    } else if (type < -3) {
        await pool.query(
            "UPDATE users SET energy = energy + $1 WHERE tg_id = $2",
            [4 + type, tg_id]
        );
        await pool.query(
            "UPDATE turns SET memo = $1 WHERE id IN (SELECT id FROM turns WHERE tg_id = $2 AND status ORDER BY created_time DESC LIMIT 1)",
            [answer, tg_id]
        );
    } else {
        await pool.query(
            "UPDATE users SET energy = energy + $1 WHERE tg_id = $2",
            [type, tg_id]
        );
        await pool.query(
            "UPDATE turns SET memo = $1 WHERE id IN (SELECT id FROM turns WHERE tg_id = $2 AND status ORDER BY created_time DESC LIMIT 1)",
            [answer, tg_id]
        );
    }
}
