import AppHeader from '@/components/layout/AppHeader';
import { useLang } from '@/context/LangContext';
import PageMeta from '@/components/seo/PageMeta';

export default function TermsOfUse() {
  const { lang } = useLang();
  const isBg = lang === 'bg';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <PageMeta
        path="/terms"
        title={isBg ? 'Условия за ползване — DigiInnov Case Lab' : 'Terms of Use — DigiInnov Case Lab'}
        description={isBg
          ? 'Правилата за използване на DigiInnov Case Lab: кой може да се регистрира, допустимо използване, авторски права и AI функции.'
          : 'The rules for using DigiInnov Case Lab: who can register, acceptable use, intellectual property and AI feature limits.'}
      />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="typo-h1 mb-2">{isBg ? 'Условия за ползване' : 'Terms of Use'}</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {isBg ? 'Последна актуализация: Април 2026' : 'Last updated: April 2026'}
        </p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          {/* 1 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '1. КОЙ ПРЕДОСТАВЯ УСЛУГАТА' : '1. Who Provides the Service'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'DigiInnov Case Lab се предоставя от Кирилка Ангелова, преподавател и създател на платформата. Контакт: contact@digiinnov.com'
                : 'DigiInnov Case Lab is provided by Kirilka Angelova, educator and platform creator. Contact: contact@digiinnov.com'}
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '2. КОЙ МОЖЕ ДА ИЗПОЛЗВА ПЛАТФОРМАТА' : '2. Who Can Use the Platform'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {isBg ? 'Платформата е предназначена за:' : 'The platform is intended for:'}
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Ученици и студенти на възраст 14 и повече години' : 'Students aged 14 and older'}</li>
              <li>{isBg ? 'Учители и преподаватели в образователни институции' : 'Teachers and instructors at educational institutions'}</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {isBg
                ? 'Ако сте на възраст под 16 години, трябва да имате съгласие от родител или настойник преди регистрация. С регистрацията потвърждавате, че отговаряте на това изискване.'
                : 'If you are under 16 years of age, you must have parental or guardian consent before registering. By registering, you confirm that you meet this requirement.'}
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '3. ВАШИЯТ АКАУНТ' : '3. Your Account'}</h2>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Вие сте отговорни за поверителността на паролата си' : 'You are responsible for the confidentiality of your password'}</li>
              <li>{isBg ? 'Не споделяйте акаунта си с други' : 'Do not share your account with others'}</li>
              <li>{isBg ? 'Предоставяйте вярна информация при регистрация' : 'Provide accurate information during registration'}</li>
              <li>{isBg
                ? 'Псевдонимът ви трябва да е подходящ — забранено е използването на имена, съдържащи обидни, дискриминационни или лични данни на трети лица'
                : 'Your nickname must be appropriate — names containing offensive, discriminatory, or third-party personal data are prohibited'}</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '4. ДОПУСТИМО ИЗПОЛЗВАНЕ' : '4. Acceptable Use'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {isBg ? 'Можете да използвате DigiInnov единствено за образователни цели.' : 'You may use DigiInnov for educational purposes only.'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-1">{isBg ? 'Забранено е:' : 'Prohibited:'}</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Подаване на плагиатствано или генерирано от AI съдържание, представено като ваше собствено' : 'Submitting plagiarized or AI-generated content presented as your own'}</li>
              <li>{isBg ? 'Манипулиране на XP точки, резултати или класации по неправомерен начин' : 'Manipulating XP points, scores, or leaderboards in an unauthorized manner'}</li>
              <li>{isBg ? 'Споделяне на отговори от тестове и казуси с цел нечестно предимство' : 'Sharing test and case answers for unfair advantage'}</li>
              <li>{isBg ? 'Публикуване на обидно, дискриминационно или вредно съдържание' : 'Publishing offensive, discriminatory, or harmful content'}</li>
              <li>{isBg ? 'Опити за нарушаване на сигурността или работата на платформата' : 'Attempting to breach the security or operation of the platform'}</li>
              <li>{isBg ? 'Използване на платформата за комерсиални цели без разрешение' : 'Using the platform for commercial purposes without permission'}</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '5. СЪДЪРЖАНИЕ И ИНТЕЛЕКТУАЛНА СОБСТВЕНОСТ' : '5. Content and Intellectual Property'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'Съдържанието на платформата (казуси, модули, симулации, речник) е интелектуална собственост на DigiInnov и не може да се копира, разпространява или използва извън платформата без писмено разрешение.'
                : 'Platform content (cases, modules, simulations, dictionary) is the intellectual property of DigiInnov and may not be copied, distributed, or used outside the platform without written permission.'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {isBg
                ? 'Вашите учебни работи (отговори, стартъп проект, анализи) са ваша интелектуална собственост. DigiInnov не претендира права върху тях. Вие давате на DigiInnov ограничен лиценз да съхранява и показва работите ви единствено за целите на образователната платформа.'
                : 'Your submissions (answers, startup project, analyses) are your intellectual property. DigiInnov does not claim rights over them. You grant DigiInnov a limited license to store and display your work solely for the purposes of the educational platform.'}
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '6. AI ФУНКЦИИ' : '6. AI Features'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {isBg
                ? 'Платформата включва AI ментор, който генерира обратна връзка върху учебните ви отговори. Тази обратна връзка е образователна помощ и:'
                : 'The platform includes an AI mentor that generates feedback on your learning answers. This feedback is educational assistance and:'}
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Не замества преценката на учителя' : 'Does not replace the teacher\'s judgment'}</li>
              <li>{isBg ? 'Може да съдържа грешки — проверявайте критично' : 'May contain errors — review critically'}</li>
              <li>{isBg ? 'Не се използва за автоматизирано оценяване с правни последствия' : 'Is not used for automated grading with legal consequences'}</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '7. ПРЕКРАТЯВАНЕ НА ДОСТЪПА' : '7. Termination of Access'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'Запазваме правото да прекратим или ограничим достъпа ти при нарушение на тези условия. При неправомерни действия може да бъде уведомена твоята образователна институция.'
                : 'We reserve the right to terminate or restrict your access if you violate these terms. In cases of misconduct, your educational institution may be notified.'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {isBg
                ? 'Можете да изтриете акаунта си по всяко време от страницата Профил. При изтриване всички ваши данни се изтриват необратимо.'
                : 'You can delete your account at any time from the Profile page. Upon deletion, all your data is permanently removed.'}
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '8. ОГРАНИЧАВАНЕ НА ОТГОВОРНОСТТА' : '8. Limitation of Liability'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'DigiInnov се предоставя „както е" за образователни цели. Не гарантираме непрекъсната наличност на платформата. Не носим отговорност за загуба на данни поради технически проблеми, форсмажор или действия на трети страни.'
                : 'DigiInnov is provided "as is" for educational purposes. We do not guarantee uninterrupted platform availability. We are not liable for data loss due to technical issues, force majeure, or third-party actions.'}
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '9. ПРИЛОЖИМО ПРАВО' : '9. Applicable Law'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'Тези условия се уреждат от законодателството на Република България. При спорове се прилага юрисдикцията на компетентния български съд.'
                : 'These terms are governed by the laws of the Republic of Bulgaria. Disputes are subject to the jurisdiction of the competent Bulgarian court.'}
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '10. ПРОМЕНИ В УСЛОВИЯТА' : '10. Changes to These Terms'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'При промяна в условията ще ви уведомим при следващо влизане. Продължаването на използването на платформата след уведомлението се счита за приемане на новите условия.'
                : 'If these terms change, we will notify you on your next login. Continued use of the platform after notification constitutes acceptance of the new terms.'}
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '11. КОНТАКТ' : '11. Contact'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <a href="mailto:contact@digiinnov.com" className="text-primary hover:underline">contact@digiinnov.com</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
