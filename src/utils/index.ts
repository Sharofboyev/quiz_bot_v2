import { QuestType, Question, UserDto } from "../services";
import ru from "./ru";

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

export function prepareTextForTakingRest(user: UserDto) {
    const { first_name, start_energy, energy } = user;
    return replaceTemplateVars(ru.end_level, {
        first_name,
        start_energy,
        energy,
    });
}

export function replaceTemplateVars(template: string, replacements: Object) {
    // Regular expression to match variable parts
    const regex = /\$\{([^}]+)\}/g;

    // Replace all occurrences with the corresponding value from the object
    return template.replace(
        regex,
        (match: any, key: string) => replacements[key] || ""
    );
}
