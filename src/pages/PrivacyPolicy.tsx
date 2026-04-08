import AppHeader from '@/components/layout/AppHeader';
import { useLang } from '@/context/LangContext';

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const isBg = lang === 'bg';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="typo-h1 mb-2">{isBg ? 'Политика за поверителност' : 'Privacy Policy'}</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {isBg ? 'Последна актуализация: Април 2026' : 'Last updated: April 2026'}
        </p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          {/* 1 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '1. КОЙ ОТГОВАРЯ ЗА ВАШИТЕ ДАННИ' : '1. Who Is Responsible for Your Data'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'Администратор на лични данни по смисъла на GDPR е: Кирилка Ангелова (физическо лице — преподавател и създател на платформата). Имейл: contact@digiinnov.com. Платформа: DigiInnov Case Lab (digiinnov.lovable.app).'
                : 'The data controller under the GDPR is: Kirilka Angelova (individual — educator and platform creator). Email: contact@digiinnov.com. Platform: DigiInnov Case Lab (digiinnov.lovable.app).'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'Ако имате въпроси относно обработката на личните ви данни, свържи се с нас на contact@digiinnov.com.'
                : 'If you have questions about how your personal data is processed, contact us at contact@digiinnov.com.'}
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '2. КАКВИ ДАННИ СЪБИРАМЕ И ЗАЩО' : '2. What Data We Collect and Why'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {isBg ? 'Събираме само данните, необходими за работата на образователната платформа.' : 'We only collect data necessary for the educational platform to function.'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold mt-3">
              {isBg ? 'При регистрация (задължителни):' : 'At registration (required):'}
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Имейл адрес — за идентификация и вход в платформата' : 'Email address — for identification and platform login'}</li>
              <li>{isBg ? 'Псевдоним — за показване в класацията (изберете сами, може да е анонимен)' : 'Nickname — for leaderboard display (you choose it, can be anonymous)'}</li>
              <li>{isBg ? 'Роля (ученик / учител) — за управление на достъпа' : 'Role (student / teacher) — for access management'}</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold mt-3">
              {isBg ? 'При регистрация (незадължителни, предоставяте по избор):' : 'At registration (optional, provided at your choice):'}
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Пълно име — видимо само за вас и вашия учител, никога публично' : 'Full name — visible only to you and your teacher, never public'}</li>
              <li>{isBg ? 'Училище / университет — за свързване с вашия клас' : 'School / university — for connecting to your class'}</li>
              <li>{isBg ? 'Клас / курс — за организиране в учебни групи' : 'Class / grade — for organizing into study groups'}</li>
              <li>{isBg ? 'Държава — за образователна статистика' : 'Country — for educational statistics'}</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold mt-3">
              {isBg ? 'Генерирани при използване на платформата:' : 'Generated during platform use:'}
            </p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Учебен напредък (XP, ниво, завършени модули и казуси)' : 'Learning progress (XP, level, completed modules and cases)'}</li>
              <li>{isBg ? 'Отговори на тестове и писмени задачи — видими само за вас и вашия учител' : 'Test and written assignment answers — visible only to you and your teacher'}</li>
              <li>{isBg ? 'Данни за използване на симулатора и стартъп проекта' : 'Simulator and startup project usage data'}</li>
              <li>{isBg ? 'AI обратна връзка — генерирана автоматично въз основа на вашите отговори' : 'AI feedback — automatically generated based on your answers'}</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 font-medium">
              {isBg ? 'НЕ събираме: телефонен номер, адрес, финансови данни, снимки.' : 'We do NOT collect: phone number, address, financial data, photos.'}
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '3. НА КАКВО ПРАВНО ОСНОВАНИЕ ОБРАБОТВАМЕ ДАННИТЕ' : '3. Legal Basis for Data Processing'}</h2>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
              <li>{isBg
                ? 'Изпълнение на договор (чл. 6, ал. 1, б. „б") — имейл и роля са необходими, за да предоставим услугата, за която сте се регистрирали.'
                : 'Performance of a contract (Art. 6(1)(b)) — email and role are necessary to provide the service you registered for.'}</li>
              <li>{isBg
                ? 'Легитимен интерес (чл. 6, ал. 1, б. „е") — учебен напредък и статистика за подобряване на образователното съдържание.'
                : 'Legitimate interest (Art. 6(1)(f)) — learning progress and statistics to improve educational content.'}</li>
              <li>{isBg
                ? 'Съгласие (чл. 6, ал. 1, б. „а") — за незадължителни данни като пълно име, училище и участие в класацията. Можете да оттеглите съгласието си по всяко време от страницата Профил.'
                : 'Consent (Art. 6(1)(a)) — for optional data such as full name, school, and leaderboard participation. You can withdraw consent at any time from the Profile page.'}</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              {isBg
                ? 'Ако сте на възраст под 16 години, регистрацията изисква съгласие от родител или законен настойник съгласно чл. 8 от GDPR и Закона за защита на личните данни в България.'
                : 'If you are under 16 years of age, registration requires consent from a parent or legal guardian under Art. 8 of the GDPR and the Bulgarian Personal Data Protection Act.'}
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '4. КАК ИЗПОЛЗВАМЕ ДАННИТЕ' : '4. How We Use Your Data'}</h2>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Предоставяне на образователната платформа и проследяване на напредъка ви' : 'Providing the educational platform and tracking your progress'}</li>
              <li>{isBg ? 'Показване на персонализирано съдържание и препоръки' : 'Displaying personalized content and recommendations'}</li>
              <li>{isBg ? 'Генериране на AI обратна връзка върху учебните ви отговори' : 'Generating AI feedback on your learning answers'}</li>
              <li>{isBg ? 'Издаване на сертификат при успешно завършване' : 'Issuing a certificate upon successful completion'}</li>
              <li>{isBg ? 'Показване в класацията (само псевдоним, само ако сте избрали тази опция)' : 'Leaderboard display (nickname only, only if you opted in)'}</li>
              <li>{isBg ? 'Достъп на вашия учител до вашия напредък (само ако сте в клас с верифициран учител)' : 'Your teacher\'s access to your progress (only if you are in a class with a verified teacher)'}</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 font-medium">
              {isBg
                ? 'НЕ продаваме, НЕ споделяме и НЕ използваме данните ви за рекламни цели. НЕ използваме данните ви за автоматизирано вземане на решения с правни последствия (профилиране по смисъла на чл. 22 от GDPR).'
                : 'We do NOT sell, share, or use your data for advertising. We do NOT use your data for automated decision-making with legal effects (profiling under Art. 22 of the GDPR).'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {isBg
                ? 'AI обратната връзка е образователна помощ — тя не оценява вас като личност и не води до автоматизирани решения, засягащи достъпа ви до платформата.'
                : 'AI feedback is educational assistance — it does not evaluate you as a person and does not lead to automated decisions affecting your platform access.'}
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '5. ТРАНСФЕР НА ДАННИ ИЗВЪН ЕС' : '5. Data Transfer Outside the EU'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'Платформата използва Supabase (базирана в САЩ) за съхранение на данни. Supabase спазва GDPR и предоставя стандартни договорни клаузи (SCC) за трансфер на данни, одобрени от Европейската комисия.'
                : 'The platform uses Supabase (based in the US) for data storage. Supabase complies with the GDPR and provides Standard Contractual Clauses (SCC) for data transfer, approved by the European Commission.'}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {isBg ? 'Повече информация: ' : 'More information: '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://supabase.com/privacy</a>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {isBg ? 'Данните ви не се споделят с никакви други трети страни.' : 'Your data is not shared with any other third parties.'}
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '6. КОЛКО ДЪЛГО ПАЗИМ ДАННИТЕ' : '6. How Long We Retain Data'}</h2>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{isBg ? 'Акаунти на ученици: до 2 години след последното влизане, след което данните се изтриват автоматично или при поискване.' : 'Student accounts: up to 2 years after last login, after which data is automatically deleted or upon request.'}</li>
              <li>{isBg ? 'Акаунти на учители: до края на учебната година + 1 година.' : 'Teacher accounts: until the end of the school year + 1 year.'}</li>
              <li>{isBg ? 'Данни от AI обратна връзка: не се съхраняват извън сесията (не се запазват).' : 'AI feedback data: not stored beyond the session (not retained).'}</li>
              <li>{isBg ? 'При изтриване на акаунт: всички лични данни се изтриват незабавно и необратимо. Анонимизирана статистика (без лична информация) може да се запази.' : 'Upon account deletion: all personal data is deleted immediately and irreversibly. Anonymized statistics (without personal information) may be retained.'}</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '7. ВАШИТЕ ПРАВА СЪГЛАСНО GDPR' : '7. Your Rights Under the GDPR'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {isBg ? 'Имате следните права по отношение на личните ви данни:' : 'You have the following rights regarding your personal data:'}
            </p>
            <ul className="text-sm text-muted-foreground list-none pl-0 space-y-1">
              <li>✓ {isBg ? 'Право на достъп — да поискате копие от данните, които пазим за вас' : 'Right of access — to request a copy of the data we hold about you'}</li>
              <li>✓ {isBg ? 'Право на коригиране — да поправите неточни данни (от страницата Профил)' : 'Right to rectification — to correct inaccurate data (from the Profile page)'}</li>
              <li>✓ {isBg ? 'Право на изтриване — да поискате пълно изтриване на акаунта и данните ви' : 'Right to erasure — to request complete deletion of your account and data'}</li>
              <li>✓ {isBg ? 'Право на ограничаване — да ограничите обработката докато разглеждаме жалба' : 'Right to restriction — to restrict processing while we review a complaint'}</li>
              <li>✓ {isBg ? 'Право на преносимост — да получите данните си в машинно четим формат' : 'Right to portability — to receive your data in a machine-readable format'}</li>
              <li>✓ {isBg ? 'Право на възражение — срещу обработка на основание легитимен интерес' : 'Right to object — against processing based on legitimate interest'}</li>
              <li>✓ {isBg ? 'Право на оттегляне на съгласие — по всяко време, без да засяга законосъобразността на предишната обработка' : 'Right to withdraw consent — at any time, without affecting the lawfulness of prior processing'}</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              {isBg ? 'За упражняване на правата си: contact@digiinnov.com. Ще отговорим в рамките на 30 дни.' : 'To exercise your rights: contact@digiinnov.com. We will respond within 30 days.'}
            </p>
            <div className="mt-3 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
              <p className="font-medium">{isBg ? 'Имате право да подадете жалба до надзорния орган:' : 'You have the right to file a complaint with the supervisory authority:'}</p>
              <p>{isBg ? 'Комисия за защита на личните данни (КЗЛД)' : 'Commission for Personal Data Protection (CPDP)'}</p>
              <p>{isBg ? 'Адрес: бул. „Проф. Цветан Лазаров" № 2, 1592 София' : 'Address: 2 Prof. Tsvetan Lazarov Blvd., 1592 Sofia, Bulgaria'}</p>
              <p>{isBg ? 'Уебсайт: ' : 'Website: '}<a href="https://www.cpdp.bg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cpdp.bg</a></p>
              <p>{isBg ? 'Имейл: kzld@cpdp.bg' : 'Email: kzld@cpdp.bg'}</p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '8. БИСКВИТКИ (COOKIES)' : '8. Cookies'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'Платформата използва само технически необходими бисквитки за поддържане на сесията ви (вход в акаунта). Не използваме рекламни или аналитични бисквитки от трети страни.'
                : 'The platform uses only technically necessary cookies to maintain your session (account login). We do not use advertising or third-party analytics cookies.'}
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '9. ПРОМЕНИ В ПОЛИТИКАТА' : '9. Changes to This Policy'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg
                ? 'При съществена промяна в политиката ще ви уведомим с банер при следващо влизане и ще поискаме ново потвърждение. Датата „Последна актуализация" показва кога е променяна политиката.'
                : 'If there is a material change to this policy, we will notify you with a banner on your next login and request renewed confirmation. The "Last updated" date shows when the policy was last changed.'}
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="typo-h2 text-lg">{isBg ? '10. КОНТАКТ' : '10. Contact'}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isBg ? 'За всички въпроси относно личните ви данни:' : 'For all questions regarding your personal data:'}
              {' '}<a href="mailto:contact@digiinnov.com" className="text-primary hover:underline">contact@digiinnov.com</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
