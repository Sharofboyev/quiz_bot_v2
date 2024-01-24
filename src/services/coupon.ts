import {
    getCoupon,
    activateCoupon,
    generateCoupon,
} from "../db/models/coupons";
import { Coupon, CouponType } from "../types";
import { generate } from "randomstring";
import { DatabaseError } from "pg";

export class CouponService {
    static async generateCoupon(couponType: CouponType): Promise<Coupon> {
        let counter = 0;
        while (true) {
            if (counter > 10) {
                throw new Error("Can't generate coupon");
            }
            counter++;
            try {
                const code = generate({
                    length: 16,
                    readable: true,
                }).toUpperCase();
                return generateCoupon(couponType, code);
            } catch (err) {
                if (err instanceof DatabaseError) {
                    // Если код уже существует, то генерируем новый
                    if (err.code === "23505") {
                        continue;
                    }
                }
            }
        }
    }

    static async getCoupon(code: string) {
        return getCoupon(code);
    }

    static async activateCoupon(code: string, tg_id: number) {
        return activateCoupon(code, tg_id);
    }
}
