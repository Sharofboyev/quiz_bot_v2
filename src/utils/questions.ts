import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { AnswerType, QuestType, Question } from "../types";
import { CellType } from "../types";
import { ru } from "./lang";

/**
 *
 * @param quest_id ид типа вопроса. 0 - блиц вопрос,  1 - вопрос, 2 - блогадорность, 3 - задание, 4 - пауза, 5 - конец
 * @returns возвращает название типа вопроса
 */
export function getQuestName(quest_id: QuestType): CellType {
    if (quest_id == QuestType.BLITZ) return CellType.BLITZ;
    else if (quest_id == QuestType.QUESTION) return CellType.QUESTION;
    else if (quest_id == QuestType.THANKFUL) return CellType.THANKFUL;
    else if (quest_id == QuestType.EXERCISE) return CellType.EXERCISE;
    else if (quest_id == QuestType.PAUSE) return CellType.PAUSE;
    else return CellType.END;
}

export function prepareTextForChosenQuestion(question: Question) {
    const { type: questType, text: questionText } = question;
    return (
        ru.you_have_chosen +
        ": " +
        getQuestName(questType) +
        "\n\n" +
        questionText +
        "\n\n___________________\n" +
        ru[`note${questType}`]
    );
}

export function convertQuestTypeToAnswerType(
    questType: QuestType,
    completed: boolean
) {
    if (questType == QuestType.BLITZ)
        return completed ? AnswerType.ANSWER_QUESTION : AnswerType.CANCEL_JUMP;
    else if (questType == QuestType.QUESTION)
        return completed
            ? AnswerType.ANSWER_QUESTION
            : AnswerType.NOT_ANSWER_QUESTION;
    else if (questType == QuestType.THANKFUL)
        return completed
            ? AnswerType.ANSWER_THANKFUL
            : AnswerType.NOT_ANSWER_THANKFUL;
    else if (questType == QuestType.EXERCISE)
        return completed
            ? AnswerType.ANSWER_EXERCISE
            : AnswerType.NOT_ANSWER_EXERCISE;
    else if (questType == QuestType.PAUSE) return AnswerType.NOT_ANSWER_PAUSE;
    else return AnswerType.CANCEL_JUMP;
}

export function prepareAnswerKeyboard(question_type: QuestType) {
    let keyboard: InlineKeyboardButton[][] = [];
    if (
        [QuestType.QUESTION, QuestType.THANKFUL, QuestType.EXERCISE].includes(
            question_type
        )
    ) {
        keyboard = [
            [
                {
                    text: ru.completed,
                    callback_data: `set_${question_type}completed`,
                },
                {
                    text: ru.incompleted,
                    callback_data: `set_${question_type}incompleted`,
                },
            ],
            [
                {
                    text: ru.come_back,
                    callback_data: `set_${question_type}come_back`,
                },
            ],
        ];
    } else {
        keyboard = [
            [
                { text: ru.get_rest, callback_data: "get_rest" },
                {
                    text: ru.get_question,
                    callback_data: "get_question",
                },
            ],
            [
                {
                    text: ru.get_exercise,
                    callback_data: "get_exercise",
                },
            ],
        ];
    }
    return keyboard;
}
