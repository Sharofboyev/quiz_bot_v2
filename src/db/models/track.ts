import pool from "..";

export async function track(data: any, from: any) {
    pool.query("INSERT INTO track (data, tg_id) VALUES ($1, $2)", [
        data,
        from,
    ]).catch((err) => {
        console.log(`Error in tracking. Error: `, err);
    });
}
