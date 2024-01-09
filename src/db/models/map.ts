import pool from "../index";
import config from "../../config";
import { NotFoundError } from "./errors";
import { Avatar, JumpType, LastJump, MapCell, QuestType } from "../../types";

export async function add_image(
    map_id: number,
    file_id: string,
    type: QuestType,
    level: number
) {
    await pool.query(
        "INSERT INTO map (map_id, file_id, type, level) VALUES ($1, $2, $3, $4)",
        [map_id, file_id, type, level]
    );
    await pool.query(
        `UPDATE map SET quest_type = (SELECT quest_type FROM map WHERE map_id = $1 AND type = $2 AND quest_type IS NOT NULL) WHERE map_id = $1`,
        [map_id, type]
    );
}

export async function get_cell_info(
    map_id: number,
    avatar: Avatar,
    level: number
): Promise<MapCell> {
    const { rows, rowCount } = await pool.query<{
        file_id: string;
        quest_type: QuestType;
    }>(
        "SELECT file_id, quest_type FROM map WHERE type = $1 AND map_id = $2 AND level = $3",
        [avatar, map_id, level]
    );

    // todo: rename column name type to avatar
    if (rowCount === 0) throw new NotFoundError("Image not found");
    else
        return {
            image: rows[0].file_id,
            questType: rows[0].quest_type,
        };
}

export async function get_last_jump(tg_id: number): Promise<LastJump | null> {
    const { rows } = await pool.query<LastJump>(
        `SELECT *, created_time < NOW() - INTERVAL '${
            config.time_out - 3
        } hours' AS can_jump FROM turns 
        WHERE tg_id = $1 AND status ORDER BY created_time DESC LIMIT 1`,
        [tg_id]
    );

    if (rows.length > 0) return rows[0];
    return null;
}

export async function move(
    jump: number,
    map_id: number,
    level: number,
    tg_id: number,
    jump_type: JumpType
) {
    if (jump_type === JumpType.FREE_JUMP_TIME) {
        await pool.query(
            `UPDATE users 
        SET 
          steps = steps + 1, 
          last_jump = $1, 
          last_map_id = $2,
          last_jump_time = NOW(), 
          level = COALESCE($3, level) 
        WHERE
          tg_id = $4`,
            [jump, map_id, level, tg_id]
        );
    } else if (jump_type === JumpType.FREE_JUMPS) {
        await pool.query(
            `UPDATE users 
          SET 
              steps = steps + 1, 
              last_jump = $1, 
              last_map_id = $2, 
              free_jumps = free_jumps - 1, 
              last_jump_time = NOW(), 
              level = COALESCE($3, level) 
          WHERE tg_id = $4`,
            [jump, map_id, level, tg_id]
        );
    } else if (jump_type === JumpType.BALANCE) {
        await pool.query(
            `UPDATE users 
          SET 
              steps = steps + 1, 
              last_jump = $1, 
              last_map_id = $2, 
              balance = balance - ${config.jump_cost}, 
              last_jump_time = NOW(), 
              level = COALESCE($3, level) 
          WHERE tg_id = $4`,
            [jump, map_id, level, tg_id]
        );
    }
}
