
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
        hero: {
            title_start: 'Prepare for ENT with an',
            title_end: 'AI Tutor',
            subtitle: 'Adaptive practice, realistic tests, instantly tailored explanations. Study smarter, not harder, and track your unstoppable progress.',
            cta_primary: 'Start Practice — Free',
            cta_secondary: 'Try Demo Chat',
            stats_papers: '1000+ Past Papers',
            stats_logic: 'AI-Powered Logic',
            mock_title: 'JauapAI Tutor',
            mock_question: 'How do I solve complex probability problems for the math section?',
            mock_answer_intro: 'Probability is all about counting favorable outcomes vs total outcomes! 🎲',
            mock_answer_detail: 'Here is a step-by-step breakdown using the formula P(A) = n(A) / n(S)...',
            input_placeholder: 'Ask a question about ENT history...',
            badges: ['History of Kazakhstan', 'Math Literacy', 'Biology'],
        },
        features: {
            personalized: { title: 'Personalized Practice', desc: 'AI adapts to your weak spots instantly.' },
            tests: { title: 'Exam-Style Tests', desc: 'Practice with real timing and formats.' },
            tracking: { title: 'Progress Tracking', desc: 'Visual analytics of your score growth.' },
            expert: { title: 'Expert Explanations', desc: 'Clear reasoning for every answer.' },
        },
        core: {
            title: 'What makes it',
            title_accent: 'unstoppable',
            subtitle: 'Built for speed, accuracy, and depth.',
            items: [
                { title: 'Lightning Fast AI', desc: 'Get answers and explanations in milliseconds, powered by advanced RAG technology tailored for UNT.' },
                { title: 'Verified Sources', desc: 'Content is strictly based on approved textbooks and past papers. No hallucinations, just facts.' },
                { title: 'Bilingual Support', desc: 'Seamlessly switch between Kazakh and Russian languages for every question and explanation.' }
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
        hero: {
            title_start: 'ҰБТ-ға',
            title_end: 'AI репетиторымен дайындал',
            subtitle: 'Бейімделгіш практика, шынайы сынақтар, жеке түсіндірмелер. Тиімді оқы және прогресті бақыла.',
            cta_primary: 'Бастау — Тегін',
            cta_secondary: 'Демо чатты байқап көру',
            stats_papers: '1000+ Өткен сұрақтар',
            stats_logic: 'AI негізіндегі логика',
            mock_title: 'JauapAI Тьютор',
            mock_question: 'Математика бөліміндегі күрделі ықтималдық есептерін қалай шығарамын?',
            mock_answer_intro: 'Ықтималдық – бұл қолайлы нәтижелерді жалпы нәтижелерге бөлу! 🎲',
            mock_answer_detail: 'Міне, P(A) = n(A) / n(S) формуласын қолдана отырып қадамдық түсіндірме...',
            input_placeholder: 'Қазақстан тарихынан сұрақ қойыңыз...',
            badges: ['Қазақстан тарихы', 'Оқу сауаттылығы', 'Биология'],
        },
        features: {
            personalized: { title: 'Жеке Дайындық', desc: 'AI сіздің әлсіз тұстарыңызға бірден бейімделеді.' },
            tests: { title: 'Емтихан Стилі', desc: 'Нақты уақыт пен форматтағы практика.' },
            tracking: { title: 'Прогресті Бақылау', desc: 'Ұпай өсуінің визуалды аналитикасы.' },
            expert: { title: 'Сарапшы Түсіндірмесі', desc: 'Әр жауап үшін нақты дәлелдеме.' },
        },
        core: {
            title: 'Бұл неге',
            title_accent: 'теңдессіз',
            subtitle: 'Жылдамдық, дәлдік және тереңдік үшін жасалған.',
            items: [
                { title: 'Жылдам AI', desc: 'ҰБТ үшін арнайы жасалған RAG технологиясымен жауаптар мен түсіндірмелерді миллисекундта алыңыз.' },
                { title: 'Тексерілген Дереккөздер', desc: 'Мазмұн тек бекітілген оқулықтар мен өткен сұрақтарға негізделген. Галлюцинация жоқ, тек фактілер.' },
                { title: 'Екі Тілді Қолдау', desc: 'Әрбір сұрақ пен түсіндірме үшін қазақ және орыс тілдері арасында еркін ауысыңыз.' }
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
        hero: {
            title_start: 'Готовься к ЕНТ с',
            title_end: 'ИИ-репетитором',
            subtitle: 'Адаптивная практика, реалистичные тесты, мгновенные объяснения. Учись умнее, а не сложнее, и отслеживай свой прогресс.',
            cta_primary: 'Начать — Бесплатно',
            cta_secondary: 'Попробовать демо',
            stats_papers: '1000+ Вопросов прошлых лет',
            stats_logic: 'Логика на базе ИИ',
            mock_title: 'JauapAI Тьютор',
            mock_question: 'Как решать сложные задачи на вероятность в математике?',
            mock_answer_intro: 'Вероятность — это отношение благоприятных исходов к общим! 🎲',
            mock_answer_detail: 'Вот пошаговый разбор с использованием формулы P(A) = n(A) / n(S)...',
            input_placeholder: 'Задай вопрос по истории Казахстана...',
            badges: ['История Казахстана', 'Мат. Грамотность', 'Биология'],
        },
        features: {
            personalized: { title: 'Персонализация', desc: 'ИИ мгновенно адаптируется к твоим слабым местам.' },
            tests: { title: 'Формат Екзамена', desc: 'Практика с реальным таймингом и форматами.' },
            tracking: { title: 'Отслеживание Прогресса', desc: 'Визуальная аналитика роста твоих баллов.' },
            expert: { title: 'Экспертные Объяснения', desc: 'Четкое обоснование для каждого ответа.' },
        },
        core: {
            title: 'Что делает это',
            title_accent: 'непобедимым',
            subtitle: 'Создано для скорости, точности и глубины.',
            items: [
                { title: 'Молниеносный ИИ', desc: 'Получай ответы и объяснения за миллисекунды, благодаря технологии RAG, настроенной для ЕНТ.' },
                { title: 'Проверенные Источники', desc: 'Контент строго основан на утвержденных учебниках и прошлых тестах. Никаких галлюцинаций, только факты.' },
                { title: 'Двуязычная Поддержка', desc: 'Легко переключайся между казахским и русским языками для каждого вопроса и объяснения.' }
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
                biology: 'Биология',
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
        }
    }
};
