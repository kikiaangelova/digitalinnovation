import AppHeader from '@/components/layout/AppHeader';
import { useLang } from '@/context/LangContext';

export default function TermsOfUse() {
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="typo-h1 mb-6">{t('Terms of Use', 'Условия за ползване')}</h1>
        <div className="prose prose-sm max-w-none text-foreground space-y-4">
          <p className="text-muted-foreground text-sm">
            {t('Last updated: April 2026', 'Последна актуализация: Април 2026')}
          </p>
          <h2 className="typo-h2 text-lg">{t('1. Acceptance', '1. Приемане')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'By accessing and using DigiInnov, you agree to be bound by these terms. If you do not agree, please do not use the platform.',
              'С достъпа и използването на DigiInnov вие се съгласявате с тези условия. Ако не сте съгласни, моля не използвайте платформата.'
            )}
          </p>
          <h2 className="typo-h2 text-lg">{t('2. User Accounts', '2. Потребителски акаунти')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration.',
              'Вие сте отговорни за поддържане на поверителността на данните за вашия акаунт. Трябва да предоставите точна информация при регистрация.'
            )}
          </p>
          <h2 className="typo-h2 text-lg">{t('3. Acceptable Use', '3. Допустимо използване')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'You may use the platform for educational purposes only. You may not submit plagiarized content, attempt to manipulate XP or scores, or engage in any activity that disrupts the platform.',
              'Можете да използвате платформата само за образователни цели. Не можете да подавате плагиатствано съдържание, да манипулирате XP или резултати, или да извършвате дейности, които нарушават работата на платформата.'
            )}
          </p>
          <h2 className="typo-h2 text-lg">{t('4. Intellectual Property', '4. Интелектуална собственост')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'All platform content, including case studies, simulations, and learning materials, is owned by DigiInnov. Your submissions remain your intellectual property.',
              'Цялото съдържание на платформата, включително казуси, симулации и учебни материали, е собственост на DigiInnov. Вашите предадени работи остават ваша интелектуална собственост.'
            )}
          </p>
          <h2 className="typo-h2 text-lg">{t('5. Contact', '5. Контакт')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'For questions about these terms, contact us at contact@digiinnov.com.',
              'За въпроси относно тези условия, свържете се с нас на contact@digiinnov.com.'
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
