import { LanguageModel } from "../types";

export const ru: LanguageModel = {
    welcome:
        "🖖 Приветствую вас, Игрок! 🖖\nВы начинаете увлекательный путь к самому себе. На этом пути вас ждут открытия и озарения, сопротивление и настойчивость. И наградой станет - более глубокое понимание себя, более осознанный подход к своей жизни.\nТо, что вы оказались сегодня здесь, - не случайно. Вы наверняка искали ответы на свои вопросы и, мы надеемся, что вы сможете найти их в этом Квесте. 🙏 \nКвест Жизни - увлекательная Игра, которая поможет задавать себе вопросы и находить на них ответы в реальности.\nВо время Игры вы будете перемещаться по красочному игровому полю, отвечать на вопросы, выполнять задания и, постепенно, менять свою жизнь к лучшему. 🌟\n📋 Подробнее о правилах Игры можно почитать в разделе «Правила Игры».\n🖋 Подробнее об авторах можно узнать в разделе «Авторы».\nНачнём?🤝",
    get_name: "Пожалуйста, представьтесь. Например: Иван Иванов",
    get_age: "Давайте познакомимся получше? Сколько вам лет?",
    get_martial_status: "Расскажите, у вас есть семья?",
    martial_statuses: [
        "Не замужем/не женат",
        "Замужем/женат",
        "Разведена/разведён",
        "Не хочу говорить",
    ],
    request_to_game:
        "Что вы хотите получить от Игры? Пишите свои мысли и ощущения в свободной форме. Это будет ваша первая запись в Дневнике Игрока",
    yes: "Да",
    no: "Нет",
    start: "Выберите нужную опцию",
    dice: "🎲 Бросок кубика",
    map: "🌀 Карта Игры",
    settings: "Настройки",
    change_lang: "Изменить язык",
    main_menu: "Главное меню",
    back: "Назад",
    choose_avatar:
        "Какой из представленных аватаров станет вашей фишкой на Игровом поле?",
    plane: "✈️ Самолёт",
    crone: "👑 Корона",
    cat: "🐈‍⬛ Кот",
    first_name: "Имя",
    last_name: "Фамилия",
    balance: "🔋 Баланс",
    energy: "⚡️ Энергия",
    avatar: "🔅 Аватар",
    martial_status: "Семейное положение",
    game_request: "📜 Запрос к Игре",
    level: "Уровень",
    steps: "🗓 Ходы на выбранном уровне",
    diary: "📖 Мой Дневник Игрока",
    none: "Не известен",
    edit: "Изменить",
    age: "Возраст",
    year: "лет",
    on_error: "Возникла ошибка. Пожалуйста, обратитесь к техподдержку",
    notification_time: "⏰ Время уведомлений",
    ask_edit: "Отправьте новое значение для ",
    wrong_value: "Пожалуйста, проверьте правильность вводимых данных",
    successful_edit: "Изменения сохранены",
    jumps_limited: "Следующий ход можно совершить только через 12 часов",
    question: "Вопрос",
    exercise: "Задание",
    thankful: "Благодарность",
    pause: "Пауза",
    cell_type: "Тип ячейки",
    dice_value: "Кубик показал значение: ",
    completed: "Сделано",
    incompleted: "Заплачу за невыполнение",
    come_back: "Не хочу выполнять, вернусь назад",
    get_rest: "Отдохнуть",
    get_question: "Получить вопрос",
    get_exercise: "Получить задание",
    note1: "Ответьте честно на поставленный вопрос. У вас есть 12 часов на размышления, но вы также можете ответить сразу. Если ваш ответ не будет зафиксирован в Дневнике Игрока, то вы потеряете 1 Энергию",
    note2: "Почувствуйте идею благодарности. Обязательно проговаривайте благодарность вслух. Благодарность приносит 2 Энергии и улучшает самочувствие! Будьте честны с собой и сразу запишите наблюдения за собой в Дневник Игрока.",
    note3: "Задания рассчитаны на исполнение в течение 3 дней. Задание считается выполненным, когда вы оставляете запись/отчет о выполненном задании в Дневнике Игрока. Если срок исполнения задания прошел, а отчет не появился, у Игрока отнимаются 3 Энергии.",
    note4: "Клетка Пауза позволяет переместиться по полю без дополнительных трат (Энергии). Однако, при желании, можно преумножить свою Энергии, выбрав вопрос или задание для выполнения.",
    note5: "",
    you_have_chosen: "Вы выбрали",
    added_energy:
        "Поздравляем! Вам добавлена Энергия. Продолжайте в том же духе!",
    removed_energy:
        "Ваша Энергия уменьшилась, но вы останетесь в текущей ячейке",
    came_back: "Вы вернулись к предыдущей ячейке",
    get_answer:
        "Подробно и честно запишите свои мысли и чувства в вашем Дневнике Игрока",
    late: "Вы чуть-чуть не успели, поэтому вы не сможете взять ни вопрос, ни задание. Насладитесь отдыхом!",
    having_rest: "Теперь вы можете отдохнуть. Насладитесь заслуженным отдыхом!",
    no_such_keyboard:
        "Пожалуйста, соблюдайте правила бота. Если вам не хватает чего-то напишите авторам",
    current_map_id: "Номер текущей ячейки",
    rules: "📋 Правила Игры",
    credits: "🖋 Авторы Игры",
    payment: "💳 Оплата Игры",
    founders:
        "Авторы Игры\n\nК Игре “Квест Жизни” я отношусь очень трепетно. Это результат многолетнего опыта, обучения, вдохновения. Привет, я - Аня, и я создала Игру, в которую сама с большим удовольствием люблю играть.\n\nЯ родилась в Казахстане, училась в Петербурге, работала в Москве, много путешествовала, и сейчас живу в Португалии.\n\nМоя Игра - это инструмент саморазвития для тех, кто готов уделять себе время, расти, сравнивать себя сегодняшнего с собой вчерашним. Иногда я шучу, что это игра для интровертов:)\n\nОформлением Игры занимается замечательный художник Ксения Залозных. Ей удалось поймать суть каждого уровня и представить его в потрясающих образах.\n\nТехнической разработкой занимается Сарвар Шарофбоев.\n\nПока наша команда очень маленькая, но мы надеемся, что с вашей помощью, мы сможем поддерживать высокое качество Игры и сможем развиваться, чтобы представлять вам новые уровни.\n\nНаши контакты:\nОбщие вопросы и наполнение - full.quest.of.life@gmail.com",
    map_id: "ячейка",
    time: "Время",
    answer: "Ответ",
    no_more: "Движение дальше не предусмотрено.",
    undefined: "Не определено",
    not_answered: "Я хочу подумать об этом более внимательно",
    not_found: "Не найдено",
    add_question: "Добавить вопрос",
    game_rule: "",
    pay: "Платеж",
    question_types: "Что вы хотите добавить?",
    send_question: "Отправьте текст вопроса",
    success_addition: "Вопрос добавлен успешно",
    capital_question: "Блиц вопрос",
    game_capital:
        "Дорогой Игрок, вы настроили Игру под свой запрос и сами настроились на Игру. Давайте приступим!",
    capital_start:
        "Для Игры в Квест Жизни вам понадобится энергия. Давайте определим, какой уровень жизненной энергии у вас на момент начала Игры. Для этого нужно ответить “да” или “нет” на вопросы блиц-игры. Поехали!",
    your_steps: "Ваш путь по игре здесь:\n",
    choose_what: "Выберите из нижеследующих чтобы их изменить",
    no_free_jumps: "Пополните баланс для следующих ходов",
    change_last_name: "фамилию",
    payment_description:
        "Выберите сумму платежа: 100 руб. - за 1 ход. Оставьте чаевые для большего количества ходов. Если вы оставите 900 руб. чаевых, то получите один бонусный ход (в сумме - 11). Безлимитный доступ - 2900 руб. чаевых. Безлимитный доступ действует 120 дней.",
    payment_title: "Получить доступ к Игре Квест Жизни",
    payment_minimum: "Минимальная сумма для платежа",
    end_capital:
        "Вы набрали ${energy} баллов. С таким уровнем энергии вы вступаете в Игру «Квест Жизни». Давайте приумножим энергию в ходе Игры!",
    current_status: "Текущий статус: ",
    author_photo:
        "AgACAgIAAxkBAAIK5mDXjcM0SjfGdpQn1GHUHpcPPBI9AAImtTEb_X_BStw3OmgakEthAQADAgADeQADIAQ",
    end_level:
        "Дорогой Игрок, ${first_name}! \n\n🎉Поздравляем! 🎉\n\n\nВы дошли до финиша, для вас завершился этот Квест. " +
        "💪 Мы надеемся, что Квест научил вас чему-то полезному и позволил лучше познакомиться с самим собой. 👍\n\n\n" +
        "В начале Игры ваш уровень Энергии составлял ${start_energy}. ⚠️\nВы пришли к финишу с уровнем Энергии ${energy}. ✅\n\n\n" +
        "🤩 Если ваша Энергия увеличилась, вы можете перейти на следующий уровень Квеста, который будет посвящен вопросам безопасности " +
        "(физической, финансовой, психологической и др.).\n\n\n" +
        "♻️ Следите за обновлениями Игры в официальном блоге https://www.instagram.com/full_quest_of_life/\n\n\n" +
        "🙏 Мы будем благодарны, если вы напишите отзыв об этой Игре по электронного почты:  full.quest.of.life@gmail.com\n\n\n" +
        "Спасибо, что играли с нами!\n" +
        "До новых встреч! 👋",
    free_jumps: "🎲Бесплатные ходы",
    free_jump_time: "🆓Бесплатно можно играть до",
    blits: "Блиц-вопрос",
    end: "Конец игры",
    no_more_questions:
        "Не осталось вопросы или задании. Пожалуйста, обращайтесь к авторам",
    notification_text:
        "Дорогой Игрок!\n🔗Возвращайся в Игру «Квест Жизни»,  там ждут новые вопросы и задания! Помни, что в успехе самое главное - постоянство. 📈\n\nТвоя жизнь - только в твоих руках, никто другой не сделает тебя счастливыми. 💪\n\n🎲Бросай кубик и выполняй условия Игры, и удивительные изменения не заставят себя ждать.😍",
    decreased_energy:
        "Дорогой Игрок!\n\nС момента твоего последнего хода прошло больше 3 дней.\n\nПоследний ход был в ",
    decreased_energy1:
        ".\n\nВозможно, привычная рутина захлестнула, а может, и новые события вдруг нахлынули лавиной. Уделять время себе и своему развитию необходимо постоянно. 📚\n\n«Квест Жизни» учит держать себя и своё развитие в фокусе внимания ежедневно. Из-за долгого простоя уровень твоей Энергии уменьшается! 📉\n\nСейчас уровень твоей Энергии: ",
    decreased_energy2:
        "! 😔\n\nВозвращайся в Игру, чтобы восполнить и преумножить свою Энергии. Помни: в успехе главное - постоянство. 💪",
    no_more_level:
        "Следующий уровень находится в разработке, и как только будет доступен, будет выслано уведомление",
    coupon: "Активировать купон",
    coupon_not_found: "Купон не найден",
    coupon_allowed_only_once: "Купон можно активировать только один раз",
    coupon_activated: "Купон активирован",
    send_coupon: "Отправьте код купона",
    generate_coupon: "Сгенерировать купон",
    coupon_types: "Какой купон вы хотите сгенерировать?",
    coupon_free_jump: "3 бесплатного хода", // 3 free jumps
    coupon_free_level: "Бесплатный уровень", // free level
    coupon_generated: "Купон создан. Код: `${code}`",
    wrong_notification_time: "Пожалуйста, введите время в формате ЧЧ:ММ",
};

export const en: LanguageModel = {
    welcome:
        "🖖 Welcome, Player! 🖖\nYou are starting an exciting journey to yourself. On this path, you will find discoveries and enlightenment, resistance and perseverance. And the reward will be - a deeper understanding of yourself, a more conscious approach to your life.\nWhat you are here today is not accidental. You were probably looking for answers to your questions and we hope that you can find them in this Quest. 🙏\nLife Quest is an exciting Game that will help you ask yourself questions and find answers to them in reality.\nDuring the Game, you will move around the colorful playing field, answer questions, perform tasks and gradually change your life for the better. 🌟\n📋 You can read more about the rules of the Game in the “Game Rules” section.\n🖋 You can learn more about the authors in the “Authors” section.\nShall we start?🤝",
    get_name: "Please introduce yourself. For example: Ivan Ivanov",
    get_age: "Let's get to know each other better? How old are you?",
    get_martial_status: "Tell me, do you have a family?",
    martial_statuses: ["Single", "Married", "Divorced", "I don't want to say"],
    request_to_game:
        "What do you want to get from the Game? Write down your thoughts and feelings in a free form. This will be your first entry in the Player's Diary",
    yes: "Yes",
    no: "No",
    start: "Choose the desired option",
    dice: "🎲 Dice roll",
    map: "🌀 Game map",
    settings: "Settings",
    change_lang: "Change language",
    main_menu: "Main menu",
    back: "Back",
    choose_avatar:
        "Which of the presented avatars will be your chip on the Game field?",
    plane: "✈️ Plane",
    crone: "👑 Crone",
    cat: "🐈‍⬛ Cat",
    first_name: "First name",
    last_name: "Last name",
    balance: "🔋 Balance",
    energy: "⚡️ Energy",
    avatar: "🔅 Avatar",
    martial_status: "Martial status",
    game_request: "📜 Game request",
    level: "Level",
    steps: "🗓 Moves at the selected level",
    diary: "📖 My Player's Diary",
    none: "Unknown",
    edit: "Edit",
    age: "Age",
    year: "years",
    on_error: "An error occurred. Please contact support",
    notification_time: "⏰ Notification time",
    ask_edit: "Send a new value for ",
    wrong_value: "Please check the correctness of the entered data",
    successful_edit: "Changes saved",
    jumps_limited: "The next move can only be made in 12 hours",
    question: "Question",
    exercise: "Exercise",
    thankful: "Thankfulness",
    pause: "Pause",
    cell_type: "Cell type",
    dice_value: "The die showed the value: ",
    completed: "Done",
    incompleted: "I will pay for non-compliance",
    come_back: "I don't want to do it, I'll be back",
    get_rest: "Rest",
    get_question: "Get a question",
    get_exercise: "Get an exercise",
    note1: "Answer the question honestly. You have 12 hours to think, but you can also answer immediately. If your answer is not recorded in the Player's Diary, you will lose 1 Energy",
    note2: "Feel the idea of gratitude. Be sure to say thank you out loud. Gratitude brings 2 Energy and improves well-being! Be honest with yourself and immediately record your observations about yourself in the Player's Diary.",
    note3: "Tasks are designed to be completed within 3 days. The task is considered completed when you leave a record/report of the completed task in the Player's Diary. If the task execution period has passed and the report has not appeared, the Player loses 3 Energy.",
    note4: "The Pause cell allows you to move around the field without additional costs (Energy). However, if desired, you can multiply your Energy by choosing a question or task to complete.",
    note5: "",
    you_have_chosen: "You have chosen",
    added_energy: "Congratulations! You have been added Energy. Keep it up!",
    removed_energy:
        "Your Energy has decreased, but you will remain in the current cell",
    came_back: "You have returned to the previous cell",
    get_answer:
        "Write down your thoughts and feelings in detail in your Player's Diary",
    late: "You just missed it, so you won't be able to take either a question or a task. Enjoy your rest!",
    having_rest: "Now you can rest. Enjoy your well-deserved rest!",
    no_such_keyboard:
        "Please follow the rules of the bot. If you lack something, write to the authors",
    current_map_id: "Current cell number",
    rules: "📋 Game Rules",
    credits: "🖋 Game Authors",
    payment: "💳 Game Payment",
    founders:
        "Game Authors\n\nI treat the Game “Life Quest” very carefully. This is the result of many years of experience, training, and inspiration. Hello, I am Anya, and I created the Game that I myself love to play with great pleasure.\n\nI was born in Kazakhstan, studied in St. Petersburg, worked in Moscow, traveled a lot, and now live in Portugal.\n\nMy Game is a self-development tool for those who are ready to devote time to themselves, grow, compare themselves today with themselves yesterday. Sometimes I joke that this is a game for introverts:)\n\nThe design of the Game is done by the wonderful artist Ksenia Zaloznykh. She managed to capture the essence of each level and present it in stunning images.\n\nThe technical development is done by Sarvar Sharofboev.\n\nOur team is very small at the moment, but we hope that with your help, we will be able to maintain the high quality of the Game and develop to present new levels to you.\n\nOur contacts:\nGeneral questions and content - ",
    map_id: "cell",
    time: "Time",
    answer: "Answer",
    no_more: "No further movement is provided.",
    undefined: "Undefined",
    not_answered: "I want to think about it more carefully",
    not_found: "Not found",
    add_question: "Add a question",
    game_rule: "",
    pay: "Payment",
    question_types: "What do you want to add?",
    send_question: "Send the question text",
    success_addition: "The question has been added successfully",
    capital_question: "Blitz question",
    game_capital:
        "Dear Player, you have customized the Game to your request and have set yourself up for the Game. Let's get started!",
    capital_start:
        "To play the Life Quest, you will need energy. Let's determine what level of life energy you have at the start of the Game. To do this, you need to answer “yes” or “no” to the blitz game questions. Let's go!",
    your_steps: "Your path in the game is here:\n",
    choose_what: "Choose from the following to change them",
    no_free_jumps: "Top up the balance for the next moves",
    change_last_name: "last name",
    payment_description:
        "Select the payment amount: 100 rubles - for 1 move. Leave a tip for more moves. If you leave 900 rubles as a tip, you will receive one bonus move (in total - 11). Unlimited access - 2900 rubles tip. Unlimited access is valid for 120 days.",
    payment_title: "Get access to the Life Quest Game",
    payment_minimum: "Minimum amount for payment",
    end_capital:
        "You scored ${energy} points. With this level of energy, you enter the Life Quest. Let's multiply the energy during the Game!",
    current_status: "Current status: ",
    author_photo:
        "AgACAgIAAxkBAAIK5mDXjcM0SjfGdpQn1GHUHpcPPBI9AAImtTEb_X_BStw3OmgakEthAQADAgADeQADIAQ",
    end_level:
        "Dear Player, ${first_name}! \n\n🎉Congratulations! 🎉\n\n\nYou have reached the finish, this Quest has ended for you. " +
        "💪 We hope that the Quest has taught you something useful and allowed you to get to know yourself better. 👍\n\n\n" +
        "At the beginning of the Game, your level of Energy was ${start_energy}. ⚠️\nYou have reached the finish with the level of Energy ${energy}. ✅\n\n\n" +
        "🤩 If your Energy has increased, you can move on to the next level of the Quest, which will be dedicated to security issues " +
        "(physical, financial, psychological, etc.).\n\n\n" +
        "♻️ Keep an eye on Game updates in the official blog https://www.instagram.com/full_quest_of_life/\n\n\n" +
        "🙏 We will be grateful if you write a review of this Game by email:",
    decreased_energy:
        "Dear Player!\n\nSince your last move, more than 3 days have passed.\n\nThe last move was at ",
    decreased_energy1:
        ".\n\nPerhaps the usual routine has overwhelmed, or maybe new events have suddenly overwhelmed. It is necessary to devote time to yourself and your development constantly. 📚\n\n“Life Quest” teaches you to keep yourself and your development in focus every day. Due to the long downtime, your Energy level decreases! 📉\n\nYour current Energy level is: ",
    decreased_energy2:
        "! 😔\n\nReturn to the Game to replenish and multiply your Energy. Remember: the main thing in success is consistency. 💪",
    no_more_level:
        "The next level is under development, and as soon as it is available, a notification will be sent",
    coupon: "Activate coupon",
    coupon_not_found: "Coupon not found",
    coupon_allowed_only_once: "The coupon can only be activated once",
    coupon_activated: "Coupon activated",
    send_coupon: "Send the coupon code",
    generate_coupon: "Generate a coupon",
    coupon_types: "What coupon do you want to generate?",
    coupon_free_jump: "3 free jumps",
    coupon_free_level: "Free level",
    coupon_generated: "Coupon created. Code: `${code}`",
    wrong_notification_time: "Please enter the time in HH:MM format",
    blits: "Blitz question",
    end: "End of the game",
    notification_text:
        "Dear Player!\n🔗Return to the Life Quest Game, there are new questions and tasks waiting for you! Remember that the most important thing in success is consistency. 📈\n\nYour life is only in your hands, no one else will make you happy. 💪\n\n🎲Roll the dice and fulfill the Game conditions, and amazing changes will not be long in coming.😍",
    free_jump_time: "🆓You can play for free until",
    free_jumps: "🎲Free moves",
    no_more_questions:
        "There are no more questions or tasks. Please contact the authors",
};


