import {
    add_question,
    answer,
    AnswerType,
    AssignQuestionDto,
    GetQuestionDto,
    QuestType,
    Question,
    assign_question,
    get_question,
} from "../db/models/questions";

export class QuestionService {
    static async get(get_question_dto: GetQuestionDto) {
        return get_question(get_question_dto);
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

export { QuestType, AnswerType, Question };
