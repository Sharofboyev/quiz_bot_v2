import {
    add_image,
    get_cell_info,
    get_last_jump,
    move,
} from "../db/models/map";
import { QuestionService } from "./questions";
import { CanJumpDto, Jump, QuestType } from "../types";
import { ru } from "../utils";
import { User } from "./user";
import { Avatar, JumpType } from "../types";
import { JumpDto } from "../types";

export class Map {
    static async get_cell_info(map_id: number, avatar: Avatar, level: number) {
        return get_cell_info(map_id, avatar, level);
    }

    static async add_image(
        map_id: number,
        file_id: string,
        type: QuestType,
        level: number
    ) {
        return add_image(map_id, file_id, type, level);
    }

    static async get_last_jump(tg_id: number) {
        return get_last_jump(tg_id);
    }

    static async canJump(tg_id: number): Promise<CanJumpDto> {
        let { map_id, level, jump_type, can_jump } = await get_last_jump(tg_id);
        if (!can_jump) {
            return {
                error: ru.jumps_limited,
                can_jump: false,
            };
        }

        const user = await User.get(tg_id);

        let jumpType: JumpType;
        if (user.free_jumps > 0) {
            jumpType = JumpType.FREE_JUMPS;
        } else if (user.free_jump_time > new Date()) {
            jumpType = JumpType.FREE_JUMP_TIME;
        } else {
            jumpType = JumpType.BALANCE;
        }

        if (jumpType === JumpType.BALANCE && user.balance < 100) {
            return {
                error: ru.no_free_jumps,
                can_jump: false,
            };
        }
        return {
            can_jump: true,
            jump_type: jumpType,
        };
    }

    /**
     *
     * @description Проверить, может ли пользователь сделать прыжок (проверить последный прыжок, проверить баланс, проверить бесплатные прыжки)
     * @param data хранит tg_id и jump - количество клеток, на которое нужно сделать прыжок
     * @returns возвращает объект с прыжком и флагом can_jump, который показывает, может ли пользователь сделать прыжок, инфо об прыжке,
     * фото клетки, на которую сделан прыжок.
     *
     * Логика последнего ячейки:
     * Если пользователь в последнем ячейки попал, то храняется last_map_id как 40, не трогая level
     * Вся логика завершении игры происходит в state хендлере
     */
    static async jump(data: JumpDto): Promise<Jump> {
        const { user, jump, jump_type } = data;
        const { tg_id, last_map_id } = user;
        let map_id: number = last_map_id,
            level: number = user.level;
        if (last_map_id === 40) {
            map_id = 0;
            level++;
        }
        if (user.last_map_id + jump > 40) {
            map_id = 40;
        } else map_id = user.last_map_id + jump;

        // Берём инфомацию о ячейке (картинка, тип вопроса)
        const cell = await get_cell_info(map_id, user.avatar, level);
        const question = await QuestionService.get_new_question({
            tg_id,
            type: cell.questType,
        });

        // Делаем прыжок здесь, потому что в get_new_question может происходить ошибка (вопросы не остались такого типа)
        await move(jump, map_id, level, user.tg_id, jump_type);
        await QuestionService.assign({
            level,
            map_id,
            question_id: question.id,
            tg_id,
        });
        return {
            jump_type,
            map_id,
            level,
            image: cell.image,
            question_text: question.text,
            qustion_type: question.type,
        };
    }
}
