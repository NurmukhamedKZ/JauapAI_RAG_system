import React, { createContext, useContext, useState } from 'react';

type Language = 'kk' | 'ru';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    kk: {
        // Sidebar
        newChat: 'Жаңа чат',
        search: 'Іздеу...',
        today: 'Бүгін',
        yesterday: 'Кеше',
        last7days: 'Соңғы 7 күн',
        older: 'Ескілер',
        loginToSeeHistory: 'Чат тарихын көру үшін кіріңіз',
        noChats: 'Чаттар жоқ',

        // ChatArea
        welcome: 'JauapAI-ға қош келдіңіз!',
        selectFilters: 'Төмендегі фильтрлерді таңдап, сұрағыңызды жазыңыз.',
        askPlaceholder: 'Сұрағыңызды жазыңыз...',
        disclaimer: 'JauapAI қателесуі мүмкін. Маңызды ақпаратты оқулықтардан тексеріңіз.',
        registerTitle: 'Тіркеліңіз',
        registerDesc: 'Чатпен сөйлесу үшін тіркеліңіз.',
        registerBtn: 'Тіркелу',
        loginBtn: 'Кіру',

        // Filters
        model: 'Модель',
        discipline: 'Пән',
        grade: 'Сынып',
        publisher: 'Баспа',
        allSubjects: 'Барлық пәндер',
        historyKaz: 'Қазақстан тарихы',
        informatics: 'Информатика',
        geography: 'География',
        mathematics: 'Математика',
        physics: 'Физика',
        allGrades: 'Барлық сыныптар',
        gradeLabel: 'сынып',
        allPublishers: 'Барлық баспалар',
        atamura: 'Атамұра',
        mektep: 'Мектеп',
        armanpv: 'АрманПВ',
        almatyKitap: 'Алматы кітап',
        'publishers.atamura': 'Атамұра',
        'publishers.mektep': 'Мектеп',
        'publishers.armanpv': 'Арман-ПВ',
        'publishers.almatykitap': 'Алматы Кітап',
        geminiFlash: 'Gemini Flash (Жылдам)',
        geminiPro: 'Gemini Pro (Дәлірек)',

        // Settings
        settings: 'Баптаулар',
        profile: 'Профиль',
        email: 'Электрондық пошта',
        fullName: 'Толық аты',
        notSet: 'Көрсетілмеген',
        subscription: 'Жазылым',
        proPlan: 'Pro жоспар',
        freePlan: 'Тегін жоспар',
        unlimitedMessages: 'Шексіз хабарламалар',
        advancedFeatures: 'Шексіз хабарламалар мен кеңейтілген мүмкіндіктер',
        geminiAccess: 'Gemini Pro',
        prioritySupport: 'Басымдық қолдау',
        nextBilling: 'Келесі төлем',
        manageSubscription: 'Жазылымды басқару',
        preferences: 'Параметрлер',
        emailNotifications: 'Email хабарламалар',
        emailNotificationsDesc: 'Жаңалықтарды email арқылы алу',
        saveChatHistory: 'Чат тарихын сақтау',
        saveChatHistoryDesc: 'Әңгімелерді сақтау',
        privacy: 'Құпиялылық',
        changePassword: 'Құпиясөзді өзгерту',
        changePasswordDesc: 'Құпиясөзді жаңарту',
        twoFactor: 'Екі факторлы аутентификация',
        twoFactorDesc: 'Қосымша қауіпсіздік қосу',
        deleteAllChats: 'Барлық чаттарды жою',
        deleteAllChatsDesc: 'Әңгіме тарихын тазалау',
        signOut: 'Шығу',
        footer: 'Қазақстан студенттері сенеді • JauapAI v1.0.0',
        language: 'Тіл',

        // Auth
        backToHome: 'Басты бетке оралу',
        welcomeBack: 'Қайта оралуыңызбен',
        signInToContinue: 'Дайындықты жалғастыру үшін кіріңіз',
        emailAddress: 'Email мекенжайы',
        heroNoRegistration: 'Тіркелу қажет емес',
        password: 'Құпиясөз',
        rememberMe: 'Мені есте сақта',
        forgotPassword: 'Құпиясөзді ұмыттыңыз ба?',
        signIn: 'Кіру',
        signingIn: 'Кіруде...',
        dontHaveAccount: 'Аккаунтыңыз жоқ па?',
        signUpFree: 'Тегін тіркелу',
        createAccount: 'Аккаунт ашу',
        startJourney: 'Грантқа сапарыңызды бүгін бастаңыз',
        fullNameLabel: 'Толық аты',

        iAgreeTo: 'Мен келісемін',
        termsOfService: 'Қызмет көрсету шарттары',
        and: 'және',
        privacyPolicy: 'Құпиялылық саясаты',
        creatingAccount: 'Аккаунт ашылуда...',
        alreadyHaveAccount: 'Аккаунтыңыз бар ма?',
        invalidCredentials: 'Email немесе құпиясөз қате',
        registrationFailed: 'Тіркелу сәтсіз аяқталды',
        orContinueWith: 'немесе',
        googleLoginFailed: 'Google арқылы кіру сәтсіз аяқталды',
        continueWithGoogle: 'Google арқылы кіру',
        loginToSaveHistory: 'Тарихты сақтау үшін кіріңіз',
        register: 'Тіркелу',
        login: 'Кіру',

        // Landing Page - Header
        'header.advantages': 'Артықшылықтар',
        'header.features': 'Мүмкіндіктер',
        'header.pricing': 'Бағалар',
        'header.about': 'Біз туралы',
        'header.cta': 'Тегін бастау',

        // Landing Page - Hero
        'hero.title_start': 'ҰБТ-ға дайындықтың',
        'hero.title_end': 'жаңа деңгейі',
        'hero.subtitle': 'JauapAI - жасанды интеллект көмегімен ҰБТ сұрақтарына жауап беріп, түсіндіретін сіздің жеке көмекшіңіз.',
        'hero.cta_primary': 'Тегін байқап көру',
        'hero.cta_secondary': 'Демо чат',
        'hero.stats_papers': '100k+ сұрақтар',
        'hero.stats_logic': '95% дәлдік',
        'hero.mock_title': 'JauapAI Көмекшісі',
        'hero.mock_question': 'Қазақ хандығының негізін кім қалады?',
        'hero.mock_answer_intro': 'Қазақ хандығының негізін 1465 жылы Керей мен Жәнібек хандар қалады.',
        'hero.mock_answer_detail': 'Толығырақ: Шу өзенінің бойында...',
        'hero.input_placeholder': 'Сұрағыңызды қойыңыз...',
        'hero.badge.math': 'Мат. сауаттылық',
        'hero.badge.history': 'Қазақстан тарихы',
        'hero.badge.physics': 'Физика',
        'hero.badge.geography': 'География',
        'hero.badge.biology': 'Биология',
        'hero.badge.chemistry': 'Химия',
        'verified.title': 'Тексерілген мазмұн',
        'verified.desc': '100% ресми ҚР БҒМ оқулықтарына негізделген.',

        // Landing Page - Features
        'features.personalized.title': 'Жеке дайындық',
        'features.personalized.desc': 'Сіздің білім деңгейіңізге бейімделген сұрақтар мен тапсырмалар.',
        'features.tests.title': 'Шынайы тесттер',
        'features.tests.desc': 'ҰБТ форматындағы тесттермен дәлме-дәл жаттығу.',
        'features.tracking.title': 'Прогресті бақылау',
        'features.tracking.desc': 'Күнделікті және апталық даму көрсеткіштеріңізді көріңіз.',
        'features.expert.title': 'Сарапшы түсіндірмесі',
        'features.expert.desc': 'Кез келген қате немесе қиын сұраққа толық түсініктеме алыңыз.',

        // Landing Page - How It Works
        'howItWorks.title': 'Қалай',
        'howItWorks.title_accent': 'жұмыс істейді?',
        'howItWorks.step1.title': 'Сұрақ қойыңыз',
        'howItWorks.step1.desc': 'Кез келген пәннен фото жүктеңіз немесе мәтін жазыңыз.',
        'howItWorks.step2.title': 'Жауап алыңыз',
        'howItWorks.step2.desc': 'AI секунд ішінде толық түсіндірмесімен жауап береді.',
        'howItWorks.step3.title': 'Нәтижені жақсартыңыз',
        'howItWorks.step3.desc': 'Қателермен жұмыс жасап, ұпайыңызды көтеріңіз.',
        'howItWorks.subtitle': 'Академиялық жетістікке жетудің үш қарапайым қадамы.',

        // Landing Page - Core Features
        'core.title': 'Негізгі',
        'core.title_accent': 'ерекшеліктер',
        'core.subtitle': 'Біздің платформа студенттердің қажеттіліктерін ескере отырып жасалған.',
        'core.item1.title': 'Жылдам жауап',
        'core.item1.desc': 'Біздің AI модельдеріміз сұрақтарды лезде өңдеп, нақты жауаптар ұсынады.',
        'core.item2.title': 'Сенімді ақпарат',
        'core.item2.desc': 'Барлық деректер ресми оқулықтар мен бағдарламаларға негізделген.',
        'core.item3.title': 'Барлық пәндер',
        'core.item3.desc': 'Жаратылыстану және гуманитарлық бағыттағы барлық пәндер қамтылған.',

        // Landing Page - Benchmarks
        'benchmarks.title': 'Оқушылардың',
        'benchmarks.title_accent': 'нәтижелері',
        'benchmarks.subtitle': 'JauapAI қолданушыларының орташа ұпай көрсеткіштері.',
        'benchmarks.stat_increase': 'Орташа балл өсімі',
        'benchmarks.stat_feedback': 'Қолдау қызметі',
        'benchmarks.chart_title': 'Пәндер бойынша үлгерім',
        'benchmarks.subjects.math': 'Математика',
        'benchmarks.subjects.history': 'Тарих',
        'benchmarks.subjects.reading': 'Оқу сауаттылығы',
        'benchmarks.subjects.biology': 'Биология',
        'benchmarks.subjects.informatics': 'Информатика',
        'benchmarks.points': 'балл',
        'benchmarks.legend_student': 'JauapAI оқушысы',
        'benchmarks.legend_average': 'Орташа көрсеткіш',

        // Testimonials
        'testimonials.title': 'Оқушылардың пікірлері',
        'testimonials.item1.text': 'JauapAI арқасында тарихтан 12 балдан 20 балға көтерілдім! Түсіндірмелері өте түсінікті.',
        'testimonials.item1.author': 'Алихан, 11 сынып',
        'testimonials.item2.text': 'Математикадан қиын есептерді суретке түсіріп жіберемін, бірден шешімін аламын. Өте ыңғайлы.',
        'testimonials.item2.author': 'Аружан, 10 сынып',
        'testimonials.item3.text': 'ҰБТ-ға дайындық үшін таптырмас құрал. Басқа сайттардан қарағанда әлдеқайда жылдам.',
        'testimonials.item3.author': 'Санжар, 11 сынып',

        // Landing Page - CTA
        'cta.title': 'Дайындықты қазір бастаңыз',
        'cta.subtitle': 'Мыңдаған оқушылар JauapAI-мен бірге грантқа дайындалуда. Сіз де қосылыңыз!',
        'cta.placeholder': 'Сіздің email поштаңыз',
        'cta.button': 'Чатқа өту',
        'cta.disclaimer': 'Тегін сынақ мерзімі бар. Кредит карта қажет емес.',
        'cta.badge': 'Шектеулі ұсыныс',

        // Landing Page - Footer
        'footer.desc': 'Қазақстандық оқушыларға арналған №1 AI ҰБТ көмекшісі.',
        'footer.product': 'Өнім',
        'footer.resources': 'Ресурстар',
        'footer.company': 'Компания',
        'footer.rights': 'Барлық құқықтар қорғалған.',
        'footer.privacy': 'Құпиялылық саясаты',

        'footer.terms': 'Қолдану ережелері',

        // Meta Tags
        'meta.title': 'JauapAI - ҰБТ сұрақтарына жауап беретін AI',
        'meta.description': 'JauapAI – Қазақстан тарихы, Математика, Физика және басқа пәндер бойынша ҰБТ сұрақтарына жылдам әрі нақты жауап беретін жасанды интеллект. Дайындықты бүгін бастаңыз!',
    },
    ru: {
        // Sidebar
        newChat: 'Новый чат',
        search: 'Поиск...',
        today: 'Сегодня',
        yesterday: 'Вчера',
        last7days: 'Последние 7 дней',
        older: 'Старые',
        loginToSeeHistory: 'Войдите, чтобы увидеть историю',
        noChats: 'Нет чатов',

        // ChatArea
        welcome: 'Добро пожаловать в JauapAI!',
        selectFilters: 'Выберите фильтры ниже и задайте вопрос.',
        askPlaceholder: 'Задайте свой вопрос...',
        disclaimer: 'JauapAI может ошибаться. Проверяйте важную информацию в учебниках.',
        registerTitle: 'Зарегистрируйтесь',
        registerDesc: 'Зарегистрируйтесь, чтобы начать чат.',
        registerBtn: 'Регистрация',
        loginBtn: 'Войти',

        // Filters
        model: 'Модель',
        discipline: 'Предмет',
        grade: 'Класс',
        publisher: 'Издательство',
        allSubjects: 'Все предметы',
        historyKaz: 'История Казахстана',
        informatics: 'Информатика',
        geography: 'География',
        mathematics: 'Математика',
        physics: 'Физика',
        allGrades: 'Все классы',
        gradeLabel: 'класс',
        allPublishers: 'Все издательства',
        atamura: 'Атамұра',
        mektep: 'Мектеп',
        armanpv: 'АрманПВ',
        almatyKitap: 'Алматы кітап',
        'publishers.atamura': 'Атамұра',
        'publishers.mektep': 'Мектеп',
        'publishers.armanpv': 'Арман-ПВ',
        'publishers.almatykitap': 'Алматы Кітап',
        geminiFlash: 'Gemini Flash (Быстрый)',
        geminiPro: 'Gemini Pro (Точный)',

        // Settings
        settings: 'Настройки',
        profile: 'Профиль',
        email: 'Email',
        fullName: 'Полное имя',
        notSet: 'Не указано',
        subscription: 'Подписка',
        proPlan: 'Pro план',
        freePlan: 'Бесплатный план',
        unlimitedMessages: 'Безлимитные сообщения',
        advancedFeatures: 'Безлимитные сообщения и расширенные функции',
        geminiAccess: 'Gemini Pro',
        prioritySupport: 'Приоритетная поддержка',
        nextBilling: 'Следующий платеж',
        manageSubscription: 'Управление подпиской',
        preferences: 'Параметры',
        emailNotifications: 'Email уведомления',
        emailNotificationsDesc: 'Получать новости по email',
        saveChatHistory: 'Сохранять историю',
        saveChatHistoryDesc: 'Сохранять ваши разговоры',
        privacy: 'Конфиденциальность',
        changePassword: 'Изменить пароль',
        changePasswordDesc: 'Обновить пароль',
        twoFactor: 'Двухфакторная аутентификация',
        twoFactorDesc: 'Дополнительная защита',
        deleteAllChats: 'Удалить все чаты',
        deleteAllChatsDesc: 'Очистить историю',
        signOut: 'Выйти',
        footer: 'Доверяют студенты Казахстана • JauapAI v1.0.0',
        language: 'Язык',

        // Auth
        backToHome: 'Вернуться на главную',
        welcomeBack: 'С возвращением',
        signInToContinue: 'Войдите, чтобы продолжить подготовку',
        emailAddress: 'Email адрес',
        password: 'Пароль',
        heroNoRegistration: 'Регистрация не требуется',
        rememberMe: 'Запомнить меня',
        forgotPassword: 'Забыли пароль?',
        signIn: 'Войти',
        signingIn: 'Вход...',
        dontHaveAccount: 'Нет аккаунта?',
        signUpFree: 'Зарегистрироваться бесплатно',
        createAccount: 'Создать аккаунт',
        startJourney: 'Начните путь к гранту сегодня',
        fullNameLabel: 'Полное имя',

        iAgreeTo: 'Я согласен с',
        termsOfService: 'Условиями обслуживания',
        and: 'и',
        privacyPolicy: 'Политикой конфиденциальности',
        creatingAccount: 'Создание аккаунта...',
        alreadyHaveAccount: 'Уже есть аккаунт?',
        invalidCredentials: 'Неверный email или пароль',
        registrationFailed: 'Ошибка регистрации',
        orContinueWith: 'или',
        googleLoginFailed: 'Ошибка входа через Google',
        continueWithGoogle: 'Войти через Google',
        loginToSaveHistory: 'Войдите для сохранения истории',
        register: 'Регистрация',
        login: 'Войти',

        // Landing Page - Header
        'header.advantages': 'Преимущества',
        'header.features': 'Возможности',
        'header.pricing': 'Цены',
        'header.about': 'О нас',
        'header.cta': 'Начать бесплатно',

        // Landing Page - Hero
        'hero.title_start': 'Новый уровень',
        'hero.title_end': 'подготовки к ЕНТ',
        'hero.subtitle': 'JauapAI - ваш персональный помощник, который объясняет и отвечает на вопросы ЕНТ с помощью искусственного интеллекта.',
        'hero.cta_primary': 'Попробовать бесплатно',
        'hero.cta_secondary': 'Демо чат',
        'hero.stats_papers': '100k+ вопросов',
        'hero.stats_logic': '95% точность',
        'hero.mock_title': 'JauapAI Ассистент',
        'hero.mock_question': 'Кто основал Казахское ханство?',
        'hero.mock_answer_intro': 'Казахское ханство было основано в 1465 году ханами Кереем и Жанибеком.',
        'hero.mock_answer_detail': 'Подробнее: В долине реки Чу...',
        'hero.input_placeholder': 'Задайте свой вопрос...',
        'hero.badge.math': 'Мат. грамотность',
        'hero.badge.history': 'История Казахстана',
        'hero.badge.physics': 'Физика',
        'hero.badge.geography': 'География',
        'hero.badge.biology': 'Биология',
        'hero.badge.chemistry': 'Химия',
        'verified.title': 'Проверенный контент',
        'verified.desc': '100% основано на официальных учебниках МОН РК.',

        // Landing Page - Features
        'features.personalized.title': 'Персональная подготовка',
        'features.personalized.desc': 'Вопросы и задачи, адаптированные под ваш уровень знаний.',
        'features.tests.title': 'Реальные тесты',
        'features.tests.desc': 'Тренировка в формате реального ЕНТ.',
        'features.tracking.title': 'Контроль прогресса',
        'features.tracking.desc': 'Отслеживайте свои ежедневные и еженедельные показатели.',
        'features.expert.title': 'Объяснения эксперта',
        'features.expert.desc': 'Получайте полные объяснения к любой ошибке или сложному вопросу.',

        // Landing Page - How It Works
        'howItWorks.title': 'Как это',
        'howItWorks.title_accent': 'работает?',
        'howItWorks.step1.title': 'Задайте вопрос',
        'howItWorks.step1.desc': 'Загрузите фото или напишите текст по любому предмету.',
        'howItWorks.step2.title': 'Получите ответ',
        'howItWorks.step2.desc': 'AI даст ответ с полным объяснением за секунды.',
        'howItWorks.step3.title': 'Улучшайте результат',
        'howItWorks.step3.desc': 'Работайте над ошибками и повышайте свой балл.',
        'howItWorks.subtitle': 'Три простых шага к академическому успеху.',

        // Landing Page - Core Features
        'core.title': 'Основные',
        'core.title_accent': 'особенности',
        'core.subtitle': 'Наша платформа создана с учетом потребностей студентов.',
        'core.item1.title': 'Быстрый ответ',
        'core.item1.desc': 'Наши AI модели мгновенно обрабатывают вопросы и дают точные ответы.',
        'core.item2.title': 'Достоверная информация',
        'core.item2.desc': 'Все данные основаны на официальных учебниках и программах.',
        'core.item3.title': 'Все предметы',
        'core.item3.desc': 'Охвачены все предметы естественно-научного и гуманитарного направлений.',

        // Landing Page - Benchmarks
        'benchmarks.title': 'Результаты',
        'benchmarks.title_accent': 'учеников',
        'benchmarks.subtitle': 'Средние показатели баллов пользователей JauapAI.',
        'benchmarks.stat_increase': 'Рост среднего балла',
        'benchmarks.stat_feedback': 'Служба поддержки',
        'benchmarks.chart_title': 'Успеваемость по предметам',
        'benchmarks.subjects.math': 'Математика',
        'benchmarks.subjects.history': 'История',
        'benchmarks.subjects.reading': 'Грамотность чтения',
        'benchmarks.subjects.biology': 'Биология',
        'benchmarks.subjects.informatics': 'Информатика',
        'benchmarks.points': 'баллов',
        'benchmarks.legend_student': 'Ученик JauapAI',
        'benchmarks.legend_average': 'Средний показатель',

        // Testimonials
        'testimonials.title': 'Отзывы учеников',
        'testimonials.item1.text': 'Благодаря JauapAI поднял историю с 15 до 35 баллов! Объяснения очень понятные.',
        'testimonials.item1.author': 'Алихан, 11 класс',
        'testimonials.item2.text': 'Фотографирую сложные задачи по математике и сразу получаю решение. Очень удобно.',
        'testimonials.item2.author': 'Аружан, 10 класс',
        'testimonials.item3.text': 'Незаменимый инструмент для подготовки к ЕНТ. Намного быстрее, чем другие сайты.',
        'testimonials.item3.author': 'Санжар, 11 класс',

        // Landing Page - CTA
        'cta.title': 'Начните подготовку сейчас',
        'cta.subtitle': 'Тысячи учеников уже готовятся к гранту с JauapAI. Присоединяйтесь!',
        'cta.placeholder': 'Ваш email адрес',
        'cta.button': 'Перейти в чат',
        'cta.disclaimer': 'Есть бесплатный пробный период. Кредитная карта не требуется.',
        'cta.badge': 'Ограниченное предложение',

        // Landing Page - Footer
        'footer.desc': '№1 AI помощник для ЕНТ для казахстанских школьников.',
        'footer.product': 'Продукт',
        'footer.resources': 'Ресурсы',
        'footer.company': 'Компания',
        'footer.rights': 'Все права защищены.',
        'footer.privacy': 'Политика конфиденциальности',

        'footer.terms': 'Условия использования',

        // Meta Tags
        'meta.title': 'JauapAI - ИИ для подготовки к ЕНТ',
        'meta.description': 'JauapAI – искусственный интеллект, дающий быстрые и точные ответы на вопросы ЕНТ по Истории Казахстана, Математике, Физике и другим предметам. Начните подготовку сегодня!',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('app_language') as Language) || 'kk';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_language', lang);
        // Force reload to ensure all components update if deep nested objects don't trigger
        // window.location.reload(); // Can avoid this if using context properly
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
