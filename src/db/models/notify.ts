import { Telegraf } from "telegraf";
import pool from "..";
import config from "../../config";
import { TgId } from "../../types";
import { ru } from "../../utils";

export async function add_to_queue(tg_id: TgId, msg_id: number, type: any) {
    try {
        await pool.query(
            "INSERT INTO queue (tg_id, msg_id, type) VALUES ($1, $2, $3)",
            [tg_id, msg_id, type]
        );
    } catch (err) {
        console.log("Error in db/add_to_queue. Error: ", err);
    }
}

export async function update_queue(queue_id: number) {
    try {
        await pool.query("UPDATE queue SET status = FALSE WHERE id = $1", [
            queue_id,
        ]);
    } catch (err) {
        console.log("Error in db/add_to_queue. Error: ", err);
    }
}

export async function get_from_queue(tg_id: number) {
    try {
        const result = await pool.query(
            "SELECT * FROM queue WHERE tg_id = $1 ORDER BY created_time DESC LIMIT 1",
            [tg_id]
        );

        return result.rows[0] || null; // Return the first row or null if no rows found
    } catch (err) {
        console.error("Error in get_from_queue. Error:", err);
    }
}

export async function notify(bot: Telegraf) {
    try {
        let res =
            await pool.query(`UPDATE users SET energy = CASE WHEN energy > 0 THEN energy - 1 ELSE 0 END,
          notified = TRUE WHERE NOT notified AND notification_time BETWEEN NOW()::time - INTERVAL '3 hours 1 minute' AND NOW()::time - INTERVAL '2 hours 59 minute 55 seconds'
          AND (NOW()::date - last_jump_time::date) % 3 = 1 AND NOW()::date - last_jump_time::date > 3 RETURNING energy, tg_id, TO_CHAR(last_jump_time::date, 'DD-MM-YYYY') AS last_jump_time
          `);
        for (let i = 0; i < (res.rowCount as number); i++) {
            bot.telegram.sendPhoto(
                res.rows[i].tg_id,
                config.decreased_energy_photo,
                {
                    caption:
                        ru.decreased_energy +
                        res.rows[i].last_jump_time +
                        ru.decreased_energy1 +
                        res.rows[i].energy +
                        ru.decreased_energy2,
                }
            );
        }
        let res2 =
            await pool.query(`UPDATE users SET notified = true WHERE NOT notified AND 
          notification_time BETWEEN NOW()::time - INTERVAL '3 hours 1 minute' AND NOW()::time - INTERVAL '2 hours 59 minute 55 seconds'
          AND last_jump_time < NOW() - INTERVAL '1 day' RETURNING tg_id`);
        pool.query(`UPDATE users SET notified = false WHERE 
          notification_time NOT BETWEEN NOW()::time - INTERVAL '3 hours 3 minutes' AND NOW()::time - INTERVAL '2 hours 57 minute' 
          AND notified`);
        return res2.rows;
    } catch (err) {
        console.log(err);
    }
}
