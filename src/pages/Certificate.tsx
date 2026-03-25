import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Award, Download, ArrowLeft } from 'lucide-react';

export default function Certificate() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en: string, bg: string) => lang === 'bg' ? bg : en;
  const certRef = useRef<HTMLDivElement>(null);

  const [examResult, setExamResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth?redirect=/certificate'); return; }
    Promise.all([
      supabase.from('final_exam_results').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('profiles').select('full_name, display_name').eq('user_id', user.id).maybeSingle(),
    ]).then(([examRes, profRes]) => {
      if (!examRes.data?.passed) {
        navigate('/final-exam');
        return;
      }
      setExamResult(examRes.data);
      setProfile(profRes.data);
      setLoading(false);
    });
  }, [user, authLoading, navigate]);

  const handlePrint = () => window.print();

  if (loading) {
    return (<div className="min-h-screen bg-background"><AppHeader /><div className="flex items-center justify-center py-20"><div className="animate-pulse text-muted-foreground">{t('Loading...', 'Зареждане...')}</div></div></div>);
  }

  const studentName = profile?.full_name || profile?.display_name || 'Student';
  const completionDate = new Date(examResult?.updated_at || Date.now()).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const score = examResult?.total_score || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden"><AppHeader /></div>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="print:hidden flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/final-exam')} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> {t('Back to Exam', 'Към изпита')}
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Download className="h-4 w-4" /> {t('Print / Save PDF', 'Принтирай / Запази PDF')}
          </Button>
        </div>

        {/* Certificate */}
        <div ref={certRef} className="bg-white border-[6px] border-double border-primary/30 rounded-lg p-12 mx-auto max-w-3xl print:border-primary/40 print:shadow-none shadow-xl">
          {/* Decorative top */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-10 w-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2 mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
              {t('Certificate of Achievement', 'Сертификат за постижение')}
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
              {t('Certificate in Digital Innovation & Startup Thinking', 'Сертификат по дигитални иновации и предприемаческо мислене')}
            </h1>
          </div>

          {/* Awarded to */}
          <div className="text-center mb-10">
            <p className="text-sm text-muted-foreground mb-2">
              {t('This certificate is awarded to', 'Този сертификат се присъжда на')}
            </p>
            <p className="text-3xl font-display font-bold text-primary border-b-2 border-primary/20 inline-block pb-2 px-8">
              {studentName}
            </p>
          </div>

          {/* Description */}
          <div className="text-center mb-10 max-w-lg mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'For successfully completing the DigiInnov Case Lab program, demonstrating competence in digital innovation analysis, startup thinking, strategic decision-making, and entrepreneurial mindset.',
                'За успешно завършване на програмата DigiInnov Case Lab, демонстрирайки компетентност в анализа на дигитални иновации, стартъп мислене, стратегическо вземане на решения и предприемачески начин на мислене.'
              )}
            </p>
          </div>

          {/* Score & Date */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('Final Score', 'Краен резултат')}</p>
              <p className="text-2xl font-bold text-foreground">{score}/100</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('Date', 'Дата')}</p>
              <p className="text-lg font-semibold text-foreground">{completionDate}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 pt-6 flex justify-between items-end">
            <div>
              <p className="text-xs text-muted-foreground">{t('Issued by', 'Издаден от')}</p>
              <p className="text-sm font-semibold text-foreground">DigiInnov Case Lab</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t('Program', 'Програма')}</p>
              <p className="text-sm font-semibold text-foreground">
                {t('Digital Innovation & Entrepreneurship', 'Дигитални иновации и предприемачество')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
