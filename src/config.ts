import { config } from "dotenv";
config();

export default {
    token: process.env.TOKEN,
    DB: {
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "postgres",
        port: Number(process.env.DB_PORT) || 5432,
        password: process.env.DB_PASSWORD || "postgres",
        user: process.env.DB_USER || "postgres",
    },
    test_pay: process.env.TEST_PAY,
    live_pay: process.env.LIVE_PAY,
    pic_dice:
        process.env.PIC_DICE ||
        "https://www.boardgamesmaker.com/AttachFiles/WebsiteImages/Product_ItemBig/FI_8321.jpg",
    time_out: Number(process.env.TIME_OUT) || 12,
    free_time: Number(process.env.FREE_TIME) || 120,
    free_pay1: Number(process.env.FREE_PAY1) || 3000,
    free_pay2: Number(process.env.FREE_PAY2) || 1000,
    free_pay3: Number(process.env.FREE_PAY3) || 600,
    owner: Number(process.env.OWNER) || 0,
    end_game_photo: process.env.END_GAME_PHOTO,
    decreased_energy_photo: process.env.DECREASED_ENERGY_PHOTO,
    jump_cost: Number(process.env.JUMP_COST) || 100,
};
