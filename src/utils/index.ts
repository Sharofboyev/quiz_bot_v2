import ru from "./ru";

/**
 *
 * @param quest_id - ид типа вопроса. 0 - блиц вопрос,  1 - вопрос, 2 - блогадорность, 3 - задание, 4 - пауза, 5 - конец
 * @returns - возвращает название типа вопроса
 */
export function quest_types(quest_id: number) {
    if (quest_id == 0) return ru.blits;
    else if (quest_id == 1) return ru.question;
    else if (quest_id == 2) return ru.thankful;
    else if (quest_id == 3) return ru.exercise;
    else if (quest_id == 4) return ru.pause;
    else return ru.end;
}
