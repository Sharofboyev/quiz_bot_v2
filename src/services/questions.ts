import {
    add_question,
    answer,
    assign_question,
    get_last_question,
    get_new_question,
} from "../db/models/questions";

import {
    AnswerType,
    AssignQuestionDto,
    GetNewQuestionDto,
    QuestType,
    Question,
} from "../types";

export class QuestionService {
    static async getLastQuestion(tg_id: number) {
        return get_last_question(tg_id);
    }

    static async get_new_question(get_question_dto: GetNewQuestionDto) {
        return get_new_question(get_question_dto);
    }

    static async assign(assign_question_dto: AssignQuestionDto) {
        return assign_question(assign_question_dto);
    }

    static async add(text: string, type: QuestType) {
        return add_question(text, type);
    }

    static async answer(tg_id: number, answer_type: AnswerType, memo?: string) {
        return answer(tg_id, answer_type, memo);
    }
}
