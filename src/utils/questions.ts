import { AnswerType, QuestType, Question, UserDto } from "../services";
import { ru } from "./lang";

/**
 *
 * @param quest_id ид типа вопроса. 0 - блиц вопрос,  1 - вопрос, 2 - блогадорность, 3 - задание, 4 - пауза, 5 - конец
 * @returns возвращает название типа вопроса
 */
export function getQuestName(quest_id: QuestType) {
    if (quest_id == QuestType.BLITZ) return ru.blits;
    else if (quest_id == QuestType.QUESTION) return ru.question;
    else if (quest_id == QuestType.THANKFUL) return ru.thankful;
    else if (quest_id == QuestType.EXERCISE) return ru.exercise;
    else if (quest_id == QuestType.PAUSE) return ru.pause;
    else return ru.end;
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
