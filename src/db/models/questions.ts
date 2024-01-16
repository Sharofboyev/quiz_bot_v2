import pool from "../index";
import { QuestionNotFoundError } from "./errors";
import {
    QuestType,
    AnswerType,
    Question,
    GetNewQuestionDto,
    AssignQuestionDto,
} from "../../types";

/**
 *
 * @param tg_id tg id of user to identify him/her
 * @param type type of question. See QuestType enum
 * @param memo optional answer to question or exercise (like, memory in diary)
 */
export async function answer(tg_id: number, type: AnswerType, memo?: string) {
    if (type == AnswerType.CANCEL_JUMP) {
        await pool.query(
            "UPDATE users SET last_map_id = last_map_id - last_jump WHERE tg_id = $1",
            [tg_id]
        );
        await pool.query(
            "UPDATE turns SET status = FALSE WHERE id IN (SELECT id FROM turns WHERE tg_id = $1 AND status ORDER BY id DESC LIMIT 1)",
            [tg_id]
        );
    } else if (type != AnswerType.NOT_ANSWER_PAUSE) {
        await pool.query(
            "UPDATE users SET energy = energy + $1 WHERE tg_id = $2",
            [type, tg_id]
        );
        await pool.query(
            "UPDATE turns SET memo = $1 WHERE id IN (SELECT id FROM turns WHERE tg_id = $2 AND status ORDER BY id DESC LIMIT 1)",
            [memo, tg_id]
        );
    }
}

export async function get_new_question(
    get_question_dto: GetNewQuestionDto
): Promise<Question> {
    const { type, blitz_question_id: id = 1, tg_id } = get_question_dto;
    let questions: Question[];
    if (
        [QuestType.QUESTION, QuestType.THANKFUL, QuestType.EXERCISE].includes(
            type
        )
    ) {
        const { rows } = await pool.query(
            `SELECT * 
            FROM questions
            WHERE 
                type = $1 AND 
                id NOT IN (SELECT quest_id FROM turns WHERE tg_id = $2)
            ORDER BY id ASC`,
            [type, tg_id]
        );

        questions = rows as Question[];
    } else {
        const { rows } = await pool.query(
            "SELECT * FROM questions WHERE type = $1 ORDER BY id ASC",
            [type]
        );
        questions = rows as Question[];
    }
    if (questions.length == 0) throw new QuestionNotFoundError();
    else if (questions.length == 1)
        return questions[0]; // If there is only one question, return it
    else if (type === QuestType.BLITZ) return questions[id - 1]; // Blitz questions will be given by order

    const randomQuestionId: number = Math.floor(
        Math.random() * Number(questions.length)
    );
    return questions[randomQuestionId]; // If there are more than one question, return random question
}

export async function assign_question(assign_question_dto: AssignQuestionDto) {
    const { level, map_id, question_id, tg_id, jump } = assign_question_dto;
    await pool.query(
        `INSERT INTO turns (tg_id, map_id, jump, quest_id, level, status) VALUES 
      ($1, $2, $3, $4, $5, TRUE)`,
        [tg_id, map_id, jump, question_id, level]
    );
}

export async function add_question(text: string, type: QuestType) {
    await pool.query("INSERT INTO questions (text, type) VALUES ($1, $2)", [
        text,
        type,
    ]);
}

export async function get_last_question(
    tg_id: number
): Promise<Question | null> {
    const { rows, rowCount } = await pool.query<Question>(
        `SELECT 
            * 
        FROM 
            questions 
        WHERE 
            id = (
                SELECT quest_id FROM turns WHERE tg_id = $1 ORDER BY id DESC LIMIT 1
            )`,
        [tg_id]
    );
    if (rowCount == 0) return null;
    return rows[0];
}
