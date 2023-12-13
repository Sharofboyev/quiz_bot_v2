import { add_image, get_cell, get_last_jump, move } from "../db/models/map";
import { QuestType } from "./questions";
import { ru } from "../utils";
import { User } from "./user";
import { Avatar, JumpType } from "../types";
import { JumpDto, JumpResponseDto } from "../types";

export class Map {
    static async get_image(map_id: number, avatar: Avatar, level: number) {
        return get_cell(map_id, avatar, level);
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

    static async jump(data: JumpDto): Promise<JumpResponseDto> {
        const { tg_id, jump } = data;
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

        await move(jump, map_id, level, tg_id, jump_type);
        const image = await get_cell(map_id, user.avatar, level);
        return {
            jump: {
                jump_type,
                map_id,
                level,
                image,
            },
            can_jump,
        };
    }
}

export { JumpType };
