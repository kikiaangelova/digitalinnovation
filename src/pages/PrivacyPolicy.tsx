import AppHeader from '@/components/layout/AppHeader';
import { useLang } from '@/context/LangContext';

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="typo-h1 mb-6">{t('Privacy Policy', 'Политика за поверителност')}</h1>
        <div className="prose prose-sm max-w-none text-foreground space-y-4">
          <p className="text-muted-foreground text-sm">
            {t('Last updated: April 2026', 'Последна актуализация: Април 2026')}
          </p>
          <h2 className="typo-h2 text-lg">{t('1. Information We Collect', '1. Информация, която събираме')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'We collect information you provide when creating an account (name, email, school) and usage data generated as you interact with the platform (progress, submissions, XP earned).',
              'Събираме информация, която предоставяте при създаване на акаунт (име, имейл, училище) и данни за използване, генерирани при взаимодействие с платформата (напредък, предадени задачи, спечелени XP).'
            )}
          </p>
          <h2 className="typo-h2 text-lg">{t('2. How We Use Your Data', '2. Как използваме вашите данни')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'Your data is used to personalize your learning experience, track progress, provide AI-powered feedback, and generate certificates. We do not sell your personal data to third parties.',
              'Вашите данни се използват за персонализиране на учебния опит, проследяване на напредъка, предоставяне на AI обратна връзка и генериране на сертификати. Не продаваме личните ви данни на трети страни.'
            )}
          </p>
          <h2 className="typo-h2 text-lg">{t('3. Data Security', '3. Сигурност на данните')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'We implement industry-standard security measures including encrypted connections, secure authentication, and access controls to protect your information.',
              'Прилагаме стандартни за индустрията мерки за сигурност, включително криптирани връзки, сигурна автентикация и контрол на достъпа за защита на вашата информация.'
            )}
          </p>
          <h2 className="typo-h2 text-lg">{t('4. Contact', '4. Контакт')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'For questions about this policy, contact us at contact@digiinnov.com.',
              'За въпроси относно тази политика, свържете се с нас на contact@digiinnov.com.'
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
