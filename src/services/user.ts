import {
    UserDto,
    add_user,
    get_user,
    update_user,
    get_diary,
    Avatar,
    DiaryPage,
    MartialStatus,
    TgId,
    UserStatus,
    UpdateUserDto,
} from "../db/models/users";

export class User {
    static async get(tg_id: number) {
        return get_user(tg_id);
    }

    static async add(user: UserDto) {
        return add_user(user);
    }

    static async update(user: UpdateUserDto) {
        update_user(user);
    }

    static async get_diary(
        tg_id: number,
        filter: {
            limit?: number;
            offset?: number;
            order?: "ASC" | "DESC";
            level?: number;
        }
    ) {
        return get_diary(tg_id, filter);
    }

    static is_admin(user: UserDto) {
        return user.status == UserStatus.ADMIN;
    }
}

export { UserDto, Avatar, DiaryPage, MartialStatus, TgId, UserStatus };
