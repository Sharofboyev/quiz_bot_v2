import { ru } from "./lang";
import { UserDto } from "../services";

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
