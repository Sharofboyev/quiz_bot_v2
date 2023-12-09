import {
    JumpType,
    add_image,
    get_image,
    get_last_jump,
    move,
} from "../db/models/map";
import { QuestType } from "../db/models/questions";
import ru from "../utils/lang";
import { User } from "./user";

export type JumpDto = {
    tg_id: number;
    jump: number;
};

export type JumpResponseDto = {
    jump?: {
        jump_type: JumpType;
        map_id: number;
        level: number;
        image: string;
    };
    can_jump: boolean;
    error?: string;
};

export class Map {
    static async get_image(map_id: number, type: QuestType, level: number) {
        return get_image(map_id, type, level);
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
        let { map_id, level, jump_type, can_jump } = await get_last_jump(
            tg_id
        );
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
        const image = await get_image(map_id, QuestType.QUESTION, level);
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
