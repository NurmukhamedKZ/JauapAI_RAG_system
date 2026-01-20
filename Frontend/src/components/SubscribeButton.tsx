import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import type { SubscriptionStatus, PaymentLink } from '../services/subscriptionService';

// Translations for subscribe button
const t = {
    en: {
        upgradeToPro: 'Upgrade to Pro',
        proActive: 'Pro Active',
        loading: 'Loading...',
        openTelegram: 'Pay via Telegram',
        starsPrice: 'stars',
        features: {
            messages: '200 messages/month',
            priority: 'Priority support',
            allFeatures: 'All features'
        },
        error: 'Error loading subscription',
        alreadyPro: 'You already have Pro!'
    },
    kk: {
        upgradeToPro: 'Pro жазылу',
        proActive: 'Pro белсенді',
        loading: 'Жүктелуде...',
        openTelegram: 'Telegram арқылы төлеу',
        starsPrice: 'жұлдыз',
        features: {
            messages: 'Айына 200 хабарлама',
            priority: 'Басым қолдау',
            allFeatures: 'Барлық мүмкіндіктер'
        },
        error: 'Жазылымды жүктеу қатесі',
        alreadyPro: 'Сізде Pro бар!'
    },
    ru: {
        upgradeToPro: 'Перейти на Pro',
        proActive: 'Pro активен',
        loading: 'Загрузка...',
        openTelegram: 'Оплата через Telegram',
        starsPrice: 'звёзд',
        features: {
            messages: '200 сообщений/месяц',
            priority: 'Приоритетная поддержка',
            allFeatures: 'Все функции'
        },
        error: 'Ошибка загрузки подписки',
        alreadyPro: 'У вас уже есть Pro!'
    }
};

interface SubscribeButtonProps {
    language?: 'en' | 'kk' | 'ru';
    className?: string;
    variant?: 'full' | 'compact';
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({
    language = 'ru',
    className = '',
    variant = 'full'
}) => {
    const [status, setStatus] = useState<SubscriptionStatus | null>(null);
    const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const translations = t[language] || t.ru;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statusData, linkData] = await Promise.all([
                    subscriptionService.getStatus(),
                    subscriptionService.getPaymentLink().catch(() => null)
                ]);
                setStatus(statusData);
                setPaymentLink(linkData);
            } catch (err) {
                // If user is not logged in or other error
                setError(translations.error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [translations.error]);

    const handleClick = () => {
        if (paymentLink?.telegram_link) {
            window.open(paymentLink.telegram_link, '_blank');
        }
    };

    if (loading) {
        return (
            <button
                disabled
                className={`subscribe-button subscribe-button--loading ${className}`}
            >
                <span className="subscribe-button__spinner"></span>
                {translations.loading}
            </button>
        );
    }

    // User already has Pro
    if (status?.plan === 'pro') {
        return (
            <div className={`subscribe-button subscribe-button--pro ${className}`}>
                <span className="subscribe-button__icon">✓</span>
                {translations.proActive}
            </div>
        );
    }

    // Error state or no payment link
    if (error || !paymentLink) {
        return null;
    }

    if (variant === 'compact') {
        return (
            <button
                onClick={handleClick}
                className={`subscribe-button subscribe-button--compact ${className}`}
            >
                <span className="subscribe-button__stars">⭐</span>
                {translations.upgradeToPro}
            </button>
        );
    }

    return (
        <div className={`subscribe-card ${className}`}>
            <div className="subscribe-card__header">
                <h3 className="subscribe-card__title">{translations.upgradeToPro}</h3>
                <div className="subscribe-card__price">
                    <span className="subscribe-card__amount">{paymentLink.price_stars}</span>
                    <span className="subscribe-card__currency">⭐ {translations.starsPrice}</span>
                </div>
            </div>

            <ul className="subscribe-card__features">
                <li>✓ {translations.features.messages}</li>
                <li>✓ {translations.features.priority}</li>
                <li>✓ {translations.features.allFeatures}</li>
            </ul>

            <button
                onClick={handleClick}
                className="subscribe-card__button"
            >
                <TelegramIcon />
                {translations.openTelegram}
            </button>
        </div>
    );
};

const TelegramIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="20"
        height="20"
        style={{ marginRight: '8px' }}
    >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

export default SubscribeButton;
