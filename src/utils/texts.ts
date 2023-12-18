import { ru } from "./lang";
import { Jump, UserDto } from "../types";
import { getQuestName } from "./questions";

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

export function upperFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function prepareJumpText(user: UserDto, jump: Jump, dice_value: number) {
    const message =
        `${ru.dice_value} ${dice_value}.\n` +
        `${ru.cell_type}: ${getQuestName(jump.qustion_type)}\n` +
        `${upperFirstLetter(ru.map_id)}: ${jump.map_id}\n` +
        `\n${jump.question_text}\n` +
        `\n___________________\n` +
        ru[`note${jump.qustion_type}`];
    return message;
}
