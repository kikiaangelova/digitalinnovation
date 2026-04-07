import { Link } from 'react-router-dom';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap } from 'lucide-react';

export default function AppFooter() {
  const { lang } = useLang();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg sim-gradient">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-base font-bold text-foreground">DigiInnov</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              {t(
                'A gamified platform for digital innovation and entrepreneurship education.',
                'Геймифицирана платформа за обучение по дигитални иновации и предприемачество.'
              )}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              {t('Platform', 'Платформа')}
            </h4>
            <nav className="space-y-2">
              <Link to="/cases" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('Case Studies', 'Бизнес казуси')}
              </Link>
              <Link to="/learn" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('Learning Modules', 'Учебни модули')}
              </Link>
              <Link to="/dictionary" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('Dictionary', 'Речник')}
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('About', 'За нас')}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              {t('Legal', 'Правна информация')}
            </h4>
            <nav className="space-y-2">
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('Privacy Policy', 'Политика за поверителност')}
              </Link>
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('Terms of Use', 'Условия за ползване')}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              {t('Contact', 'Контакт')}
            </h4>
            <nav className="space-y-2">
              <a href="mailto:contact@digiinnov.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                contact@digiinnov.com
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {year} DigiInnov. {t('All rights reserved.', 'Всички права запазени.')}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('Privacy', 'Поверителност')}
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t('Terms', 'Условия')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
