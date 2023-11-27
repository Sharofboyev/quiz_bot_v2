import { User } from "./src/services/user";

User.get_diary(346686979, { level: 1 })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
