
export type Language = 'en' | 'kk' | 'ru';

export const translations = {
    en: {
        header: {
            advantages: 'Advantages',
            features: 'Features',
            pricing: 'Pricing',
            about: 'About',
            cta: 'Start Practice',
        },
        meta: {
            title: 'JauapAI - The Best UNT/ENT Exam Preparation & AI Tutor',
            description: 'Master the ENT/UNT exam with JauapAI. Instant answers from official textbooks, personalized practice tests, and probability/math logic explanations. Start for free.',
        },
        hero: {
            title_start: 'JauapAI: Your Shortest Path',
            title_end: 'to a UNT Grant',
            subtitle: 'Stop wasting time searching through dozens of textbooks. JauapAI finds the exact answer from official ENT books instantly.',
            cta_primary: 'Start Practice — Free',
            cta_secondary: 'Try Demo Chat',
            stats_papers: 'All Official Textbooks',
            stats_logic: 'Instant Answers',
            mock_title: 'JauapAI Tutor',
            mock_question: 'How do I solve complex probability problems for the math section?',
            mock_answer_intro: 'Probability is all about counting favorable outcomes vs total outcomes! 🎲',
            mock_answer_detail: 'Here is a step-by-step breakdown using the formula P(A) = n(A) / n(S)...',
            input_placeholder: 'Ask a question about ENT history...',
            no_registration: 'No Registration Required for First 3 Questions',
            badges: ['History of Kazakhstan', 'Math Literacy', 'Biology'],
            chips: {
                math: 'Solve this math problem',
                history: 'Explain 1916 revolt',
                biology: 'Biology definitions'
            }
        },
        features: {
            personalized: { title: 'Personalized Practice', desc: 'AI adapts to your weak spots instantly.' },
            tests: { title: 'Exam-Style Tests', desc: 'Practice with real timing and formats.' },
            tracking: { title: 'Progress Tracking', desc: 'Visual analytics of your score growth.' },
            expert: { title: 'Expert Explanations', desc: 'Clear reasoning for every answer.' },
        },
        publishers: {
            title: 'Trusted by Students using Official Textbooks',
        },
        testimonials: {
            title: 'Success Stories',
            item1: { text: "Helped me add 15 points to my Math score!", author: "Aruzhan, 11th Grade" },
            item2: { text: "The probability explanations finally made sense.", author: "Bekzat, 10th Grade" },
            item3: { text: "Perfect for quick revision before tests.", author: "Diana, 11th Grade" }
        },
        core: {
            title: 'Why JauapAI',
            title_accent: 'works',
            subtitle: 'The only tool you need to master the UNT.',
            items: [
                { title: 'All Textbooks in One Chat', desc: 'Access every page of every official Grade 5-11 textbook instantly. No more searching.' },
                { title: 'Answers You Can Trust', desc: '100% verified by official sources. We only use approved content, so you get the right answers.' },
                { title: 'Study in Your Language', desc: 'Think in Kazakh? Study in Kazakh. Switch between languages instantly to understand every detail.' }
            ]
        },
        howItWorks: {
            title: '3 Steps to',
            title_accent: 'Success',
            steps: [
                { title: 'Ask Any Question', desc: 'Select your subject and ask about any topic you find difficult.' },
                { title: 'Get Verified Answers', desc: 'Our AI finds the exact explanation from official textbooks in seconds.' },
                { title: 'Master the Exam', desc: 'Understand the logic, close your knowledge gaps, and boost your score.' }
            ]
        },
        benchmarks: {
            title: 'Proven performance across',
            title_accent: 'benchmarks',
            subtitle: 'Our AI model consistently outperforms average student scores, identifying gaps and closing them in record time.',
            stat_increase: 'Average Score Increase',
            stat_feedback: 'Instant Feedback',
            chart_title: 'Subject Proficiency vs. Average',
            legend_student: 'JauapAI Student',
            legend_average: 'National Average',
            subjects: {
                math: 'Math Literacy',
                history: 'History of Kazakhstan',
                reading: 'Reading Literacy',
                biology: 'Biology',
            }
        },
        cta: {
            title: 'Ready to ace the UNT?',
            subtitle: 'Join thousands of students getting smarter every day. Start your personalized learning journey now.',
            placeholder: 'Enter your email',
            button: 'Start Now',
            disclaimer: 'No credit card required. Free 7-day trial.'
        },
        footer: {
            desc: 'The smartest way to prepare for the UNT. Adaptive AI tutoring tailored to your learning style.',
            product: 'Product',
            resources: 'Resources',
            company: 'Company',
            rights: 'All rights reserved.',
            privacy: 'Privacy Policy',
            terms: 'Terms of Service',
        },
        sidebar: {
            newChat: 'New chat',
            search: 'Search...',
            loginToSeeHistory: 'Login to see your chat history',
            noChats: 'No chat history found',
            today: 'Today',
            yesterday: 'Yesterday',
            last7days: 'Previous 7 Days',
            older: 'Older',
            loginToSaveHistory: 'Login to save your chat history',
            register: 'Register',
            login: 'Login',
        }
    },
    kk: {
        header: {
            advantages: 'Артықшылықтар',
            features: 'Мүмкіндіктер',
            pricing: 'Бағалар',
            about: 'Біз туралы',
            cta: 'Дайындықты бастау',
        },
        meta: {
            title: 'JauapAI - ҰБТ-ға дайындық | Грантқа түсу құралы',
            description: 'JauapAI-мен ҰБТ-ға дайындал. Ресми оқулықтардан лезде жауап, жеке тесттер және математикалық логика түсіндірмелері. Тегін баста.',
        },
        hero: {
            title_start: 'Грантқа апаратын',
            title_end: 'Ең қысқа жол',
            subtitle: 'Ондаған оқулықтарды ақтаруға уақыт жоғалтпа. JauapAI ресми ҰБТ кітаптарынан нақты жауапты лезде табады.',
            cta_primary: 'Бастау — Тегін',
            cta_secondary: 'Демо чатты байқап көру',
            stats_papers: 'Барлық оқулықтар',
            stats_logic: 'Жылдам жауаптар',
            mock_title: 'JauapAI Тьютор',
            mock_question: 'Математика бөліміндегі күрделі ықтималдық есептерін қалай шығарамын?',
            mock_answer_intro: 'Ықтималдық – бұл қолайлы нәтижелерді жалпы нәтижелерге бөлу! 🎲',
            mock_answer_detail: 'Міне, P(A) = n(A) / n(S) формуласын қолдана отырып қадамдық түсіндірме...',
            input_placeholder: 'Қазақстан тарихынан сұрақ қойыңыз...',
            no_registration: 'Алғашқы 3 сұраққа тіркелу қажет емес',
            badges: ['Қазақстан тарихы', 'Оқу сауаттылығы', 'Биология'],
            chips: {
                math: 'Математика есебін шығар',
                history: '1916 жылғы көтерілісті түсіндір',
                biology: 'Биология анықтамалары'
            }
        },
        features: {
            personalized: { title: 'Жеке Дайындық', desc: 'AI сіздің әлсіз тұстарыңызға бірден бейімделеді.' },
            tests: { title: 'Емтихан Стилі', desc: 'Нақты уақыт пен форматтағы практика.' },
            tracking: { title: 'Прогресті Бақылау', desc: 'Ұпай өсуінің визуалды аналитикасы.' },
            expert: { title: 'Сарапшы Түсіндірмесі', desc: 'Әр жауап үшін нақты дәлелдеме.' },
        },
        publishers: {
            title: 'Ресми оқулықтарды қолданатын оқушылар сенімі',
        },
        testimonials: {
            title: 'Жетістік тарихтары',
            item1: { text: "Математикадан 15 ұпай қосуға көмектесті!", author: "Аружан, 11-сынып" },
            item2: { text: "Ықтималдық түсіндірмелері енді түсінікті болды.", author: "Бекзат, 10-сынып" },
            item3: { text: "Тест алдында жылдам қайталау үшін өте ыңғайлы.", author: "Диана, 11-сынып" }
        },
        core: {
            title: 'Неге JauapAI',
            title_accent: 'тиімді',
            subtitle: 'ҰБТ-ны меңгеру үшін қажет жалғыз құрал.',
            items: [
                { title: 'Барлық оқулықтар бір чатта', desc: '5-11 сыныптың барлық ресми оқулықтарына лезде қол жеткіз. Іздеудің қажеті жоқ.' },
                { title: 'Сенімді жауаптар', desc: 'Ресми дереккөздермен 100% тексерілген. Біз тек бекітілген мазмұнды қолданамыз.' },
                { title: 'Өз тіліңде оқы', desc: 'Орысша ойлайсың ба? Орысша оқы. Әр детальді түсіну үшін тілді лезде ауыстыр.' }
            ]
        },
        howItWorks: {
            title: 'Жетістікке жетудің',
            title_accent: '3 қадамы',
            steps: [
                { title: 'Сұрақ қой', desc: 'Пәнді таңдап, түсінбей жүрген кез келген тақырыпты сұра.' },
                { title: 'Тексерілген жауап ал', desc: 'Біздің AI ресми оқулықтардан нақты түсіндірмені секундтарда табады.' },
                { title: 'ҰБТ-ны сәтті тапсыр', desc: 'Логиканы түсініп, білімдегі олқылықтарды жой және ұпайыңды көтер.' }
            ]
        },
        benchmarks: {
            title: 'Көрсеткіштер бойынша',
            title_accent: 'дәлелденген нәтиже',
            subtitle: 'Біздің AI моделіміз оқушылардың орташа ұпайынан тұрақты түрде асып түседі, олқылықтарды анықтап, оларды рекордтық уақытта жабады.',
            stat_increase: 'Орташа Ұпай Өсімі',
            stat_feedback: 'Лезде Кері Байланыс',
            chart_title: 'Пәндер бойынша үлгерім',
            legend_student: 'JauapAI Оқушысы',
            legend_average: 'Ұлттық Орташа',
            subjects: {
                math: 'Мат. Сауаттылық',
                history: 'Қазақстан Тарихы',
                reading: 'Оқу Сауаттылығы',
                biology: 'Биология',
            }
        },
        cta: {
            title: 'ҰБТ-ны сәтті тапсыруға дайынсыз ба?',
            subtitle: 'Күн сайын білімін арттырып жатқан мыңдаған оқушыға қосыл. Жеке дайындығыңды қазір баста.',
            placeholder: 'Email енгізіңіз',
            button: 'Қазір Бастау',
            disclaimer: 'Карта қажет емес. 7 күн тегін.'
        },
        footer: {
            desc: 'ҰБТ-ға дайындалудың ең ақылды жолы. Сіздің оқу стиліңізге бейімделген AI тюторинг.',
            product: 'Өнім',
            resources: 'Ресурстар',
            company: 'Компания',
            rights: 'Барлық құқықтар қорғалған.',
            privacy: 'Құпиялылық саясаты',
            terms: 'Қызмет көрсету шарттары',
        },
        sidebar: {
            newChat: 'Жаңа чат',
            search: 'Іздеу...',
            loginToSeeHistory: 'Чат тарихын көру үшін кіріңіз',
            noChats: 'Чат тарихы табылмады',
            today: 'Бүгін',
            yesterday: 'Кеше',
            last7days: 'Соңғы 7 күн',
            older: 'Ескірек',
            loginToSaveHistory: 'Чат тарихын сақтау үшін кіріңіз',
            register: 'Тіркелу',
            login: 'Кіру',
        }
    },
    ru: {
        header: {
            advantages: 'Преимущества',
            features: 'Возможности',
            pricing: 'Цены',
            about: 'О нас',
            cta: 'Начать практику',
        },
        meta: {
            title: 'JauapAI - Подготовка к ЕНТ c ИИ | Решебник и Тесты',
            description: 'Подготовься к ЕНТ с JauapAI. Мгновенные ответы из официальных учебников, персональные тесты и объяснения задач. Начни бесплатно.',
        },
        hero: {
            title_start: 'Твой короткий путь',
            title_end: 'к гранту',
            subtitle: 'Перестань тратить время на поиск в десятках учебников. JauapAI мгновенно находит точный ответ из официальных книг ЕНТ.',
            cta_primary: 'Начать — Бесплатно',
            cta_secondary: 'Попробовать демо',
            stats_papers: 'Все официальные учебники',
            stats_logic: 'Мгновенные ответы',
            mock_title: 'JauapAI Тьютор',
            mock_question: 'Как решать сложные задачи на вероятность в математике?',
            mock_answer_intro: 'Вероятность — это отношение благоприятных исходов к общим! 🎲',
            mock_answer_detail: 'Вот пошаговый разбор с использованием формулы P(A) = n(A) / n(S)...',
            input_placeholder: 'Задай вопрос по истории Казахстана...',
            no_registration: 'Регистрация не требуется для первых 3 вопросов',
            badges: ['История Казахстана', 'Мат. Грамотность', 'Биология'],
            chips: {
                math: 'Реши задачу по математике',
                history: 'Объясни восстание 1916 года',
                biology: 'Определения по биологии'
            }
        },
        features: {
            personalized: { title: 'Персонализация', desc: 'ИИ мгновенно адаптируется к твоим слабым местам.' },
            tests: { title: 'Формат Екзамена', desc: 'Практика с реальным таймингом и форматами.' },
            tracking: { title: 'Отслеживание Прогресса', desc: 'Визуальная аналитика роста твоих баллов.' },
            expert: { title: 'Объяснения эксперта', desc: 'Получайте полные объяснения к любой ошибке или сложному вопросу.' },
        },
        publishers: {
            title: 'Нам доверяют, используя официальные учебники',
        },
        testimonials: {
            title: 'Истории успеха',
            item1: { text: "Помогло добавить 15 баллов по математике!", author: "Аружан, 11 класс" },
            item2: { text: "Объяснения вероятности наконец-то стали понятны.", author: "Бекзат, 10 класс" },
            item3: { text: "Идеально для быстрого повторения перед тестом.", author: "Диана, 11 класс" }
        },
        core: {
            title: 'Почему JauapAI',
            title_accent: 'работает',
            subtitle: 'Единственный инструмент, который нужен для сдачи ЕНТ.',
            items: [
                { title: 'Все учебники в одном чате', desc: 'Доступ к каждой странице каждого официального учебника 5-11 классов. Больше никаких поисков.' },
                { title: 'Ответы, которым можно доверять', desc: '100% проверено по официальным источникам. Мы используем только утвержденный контент.' },
                { title: 'Учись на своем языке', desc: 'Думаешь на казахском? Учись на казахском. Мгновенно переключайся между языками.' }
            ]
        },
        howItWorks: {
            title: '3 шага к',
            title_accent: 'успеху',
            steps: [
                { title: 'Задай любой вопрос', desc: 'Выбери предмет и спроси о любой теме, которая вызывает трудности.' },
                { title: 'Получи проверенный ответ', desc: 'Наш ИИ находит точное объяснение из официальных учебников за секунды.' },
                { title: 'Сдай ЕНТ на отлично', desc: 'Пойми логику, закрой пробелы в знаниях и повысь свой балл.' }
            ]
        },
        benchmarks: {
            title: 'Доказанная эффективность в',
            title_accent: 'цифрах',
            subtitle: 'Наша модель ИИ стабильно превосходит средние показатели учеников, выявляя пробелы и устраняя их в рекордные сроки.',
            stat_increase: 'Рост Среднего Балла',
            stat_feedback: 'Мгновенная Обратная Связь',
            chart_title: 'Успеваемость по предметам',
            legend_student: 'Ученик JauapAI',
            legend_average: 'Средний по стране',
            subjects: {
                math: 'Мат. Грамотность',
                history: 'История Казахстана',
                reading: 'Грамотность Чтения',
                biology: 'Физика',
            }
        },
        cta: {
            title: 'Готов сдать ЕНТ на отлично?',
            subtitle: 'Присоединяйся к тысячам учеников. Начни свой персональный путь обучения сейчас.',
            placeholder: 'Введите ваш email',
            button: 'Начать Сейчас',
            disclaimer: 'Карта не требуется. 7 дней бесплатно.'
        },
        footer: {
            desc: 'Самый умный способ подготовки к ЕНТ. Адаптивное репетиторство с ИИ, настроенное под твой стиль обучения.',
            product: 'Продукт',
            resources: 'Ресурсы',
            company: 'Компания',
            rights: 'Все права защищены.',
            privacy: 'Политика конфиденциальности',
            terms: 'Условия обслуживания',
        },
        sidebar: {
            newChat: 'Новый чат',
            search: 'Поиск...',
            loginToSeeHistory: 'Войдите, чтобы увидеть историю',
            noChats: 'История чатов не найдена',
            today: 'Сегодня',
            yesterday: 'Вчера',
            last7days: 'Последние 7 дней',
            older: 'Более старые',
            loginToSaveHistory: 'Войдите, чтобы сохранить историю',
            register: 'Регистрация',
            login: 'Войти',
        }
    }
};
