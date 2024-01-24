import pool from "..";
import { Coupon, CouponType } from "../../types";
import { CouponNotFoundError } from "./errors";

export async function generateCoupon(
    couponType: CouponType,
    code: string
): Promise<Coupon> {
    const { rows } = await pool.query<Coupon>(
        `INSERT INTO coupons (code, type) VALUES ($1, $2) RETURNING *`,
        [code, couponType]
    );
    return rows[0];
}

export async function getCoupon(code: string): Promise<Coupon> {
    const { rows } = await pool.query<Coupon>(
        `SELECT 
            *,
            CASE WHEN activated_time IS NULL
                THEN FALSE
                ELSE TRUE
            END AS used
        FROM coupons WHERE code = $1`,
        [code]
    );
    if (rows.length === 0) throw new CouponNotFoundError();
    return rows[0];
}

export async function activateCoupon(code: string, tg_id: number) {
    await pool.query<Coupon>(
        `UPDATE coupons SET activated_time = NOW(), tg_id = $1 WHERE code = $2 `,
        [tg_id, code]
    );
}
