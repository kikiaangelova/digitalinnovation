import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import KikiCaseLabCard from '@/components/case/KikiCaseLabCard';
import CaseAnswerMentor from '@/components/case/CaseAnswerMentor';
import CaseLibrary from '@/pages/CaseLibrary';
import CasePreview from '@/pages/CasePreview';

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('@/components/layout/AppHeader', () => ({
  default: () => <div data-testid="hdr" />,
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: null, isAdmin: false, userRole: 'student' }),
  AuthProvider: ({ children }: any) => children,
}));

vi.mock('@/context/ProgressContext', () => ({
  useProgress: () => ({ completedCaseIds: new Set<string>() }),
  ProgressProvider: ({ children }: any) => children,
}));

vi.mock('@/context/LangContext', () => ({
  useLang: vi.fn(),
  LangProvider: ({ children }: any) => children,
}));

import { useLang } from '@/context/LangContext';

const mockSupabaseSelectResult = (data: any) => ({
  eq: () => ({
    maybeSingle: () => Promise.resolve({ data, error: null }),
    order: () => Promise.resolve({ data, error: null }),
  }),
  order: () => Promise.resolve({ data, error: null }),
});

const MOCK_CASE_ID = '11111111-2222-3333-4444-555555555555';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { feedback: 'ok' }, error: null })),
    },
    from: (table: string) => {
      const data =
        table === 'case_studies'
          ? [
              {
                id: MOCK_CASE_ID,
                title: 'Mock Case',
                title_bg: 'Мок казус',
                description: 'A short mock case for testing.',
                description_bg: 'Кратък мок казус за тестване.',
                topic: 'Business Model',
                topic_bg: 'Бизнес модел',
                difficulty: 'intermediate',
                est_minutes: 45,
                outcomes: ['outcome'],
                outcomes_bg: ['резултат'],
                published: true,
              },
            ]
          : table === 'case_steps'
          ? []
          : null;
      return {
        select: () => mockSupabaseSelectResult(data),
      };
    },
  },
}));

function renderWithLang(
  ui: React.ReactNode,
  { lang = 'en', initialEntries = ['/'] }: { lang?: 'en' | 'bg'; initialEntries?: string[] } = {},
) {
  (useLang as any).mockReturnValue({
    lang,
    t: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      min: 'min',
      loadingCases: 'Loading…',
    },
    setLang: vi.fn(),
  });
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

async function waitForLoaded() {
  await screen.findByTestId('hdr');
  await new Promise((r) => setTimeout(r, 0));
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── KikiCaseLabCard ─────────────────────────────────────────────────────
describe('KikiCaseLabCard — static guidance', () => {
  it('renders library guidance in English', () => {
    render(<KikiCaseLabCard variant="library" lang="en" />);
    expect(screen.getByText('Kiki AI in Case Lab')).toBeInTheDocument();
    expect(
      screen.getByText(/Kiki will help you choose cases and think more clearly/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Kiki will not solve the case for you/i),
    ).toBeInTheDocument();
  });

  it('renders library guidance in Bulgarian', () => {
    render(<KikiCaseLabCard variant="library" lang="bg" />);
    expect(screen.getByText('Kiki AI в Case Lab')).toBeInTheDocument();
    expect(
      screen.getByText(/Kiki ще ти помага да избираш казуси/i),
    ).toBeInTheDocument();
  });

  it('renders preview preparation questions in English', () => {
    render(<KikiCaseLabCard variant="preview" lang="en" />);
    expect(screen.getByText('Before you start, Kiki would ask:')).toBeInTheDocument();
    expect(screen.getByText('What decision do you need to make in this case?')).toBeInTheDocument();
    expect(
      screen.getByText(/Think first on your own. Then use Kiki/i),
    ).toBeInTheDocument();
  });

  it('renders preview preparation questions in Bulgarian', () => {
    render(<KikiCaseLabCard variant="preview" lang="bg" />);
    expect(screen.getByText('Преди да започнеш, Kiki би те попитала:')).toBeInTheDocument();
    expect(screen.getByText(/Какво решение трябва да вземеш в този казус?/)).toBeInTheDocument();
  });

  it('contains no interactive chat elements', () => {
    render(<KikiCaseLabCard variant="library" lang="en" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('has distinct data-testids for variants', () => {
    const { rerender } = render(<KikiCaseLabCard variant="library" lang="en" />);
    expect(screen.getByTestId('kiki-case-lab-card')).toBeInTheDocument();
    rerender(<KikiCaseLabCard variant="preview" lang="en" />);
    expect(screen.getByTestId('kiki-case-prep-card')).toBeInTheDocument();
  });
});

// ── CaseAnswerMentor ───────────────────────────────────────────────────
describe('CaseAnswerMentor — Kiki AI labels', () => {
  it('shows Kiki AI label and button text in English', () => {
    render(
      <CaseAnswerMentor
        questionId="q1"
        questionPrompt="prompt"
        questionType="long_answer"
        studentAnswer="a reasonable length answer has at least twenty chars"
        caseTitle="Case"
        difficulty="intermediate"
        lang="en"
      />,
    );
    expect(screen.getByText('Kiki AI — check your thinking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Kiki AI feedback/i })).toBeInTheDocument();
    expect(screen.queryByText(/AI Mentor Feedback/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Get AI Mentor Feedback/i)).not.toBeInTheDocument();
  });

  it('shows Kiki AI label and button text in Bulgarian', () => {
    render(
      <CaseAnswerMentor
        questionId="q1"
        questionPrompt="prompt"
        questionType="long_answer"
        studentAnswer="достатъчно дълъг отговор на български език"
        caseTitle="Казус"
        difficulty="intermediate"
        lang="bg"
      />,
    );
    expect(screen.getByText('Kiki AI — провери мисленето си')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Получи обратна връзка от Kiki AI/i }),
    ).toBeInTheDocument();
  });

  it('is hidden for multiple_choice questions', () => {
    const { container } = render(
      <CaseAnswerMentor
        questionId="q1"
        questionPrompt="prompt"
        questionType="multiple_choice"
        studentAnswer="A"
        caseTitle="Case"
        difficulty="beginner"
        lang="en"
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});

// ── CaseLibrary integration ─────────────────────────────────────────────
describe('CaseLibrary — Kiki visibility', () => {
  it('displays Kiki AI guidance card on the library page (EN)', async () => {
    renderWithLang(
      <Routes>
        <Route path="/" element={<CaseLibrary />} />
      </Routes>,
      { lang: 'en' },
    );
    await waitForLoaded();
    expect(screen.getByTestId('kiki-case-lab-card')).toBeInTheDocument();
    expect(screen.getByText('Kiki AI in Case Lab')).toBeInTheDocument();
  });

  it('displays Bulgarian Kiki AI guidance card (BG)', async () => {
    renderWithLang(
      <Routes>
        <Route path="/" element={<CaseLibrary />} />
      </Routes>,
      { lang: 'bg' },
    );
    await waitForLoaded();
    expect(screen.getByTestId('kiki-case-lab-card')).toBeInTheDocument();
    expect(screen.getByText('Kiki AI в Case Lab')).toBeInTheDocument();
  });
});

// ── CasePreview integration ─────────────────────────────────────────────
describe('CasePreview — Kiki visibility', () => {
  it('displays Kiki preparation card before the case CTA (EN)', async () => {
    renderWithLang(
      <Routes>
        <Route path="/cases/:id" element={<CasePreview />} />
      </Routes>,
      {
        lang: 'en',
        initialEntries: [`/cases/${MOCK_CASE_ID}`],
      },
    );
    await waitForLoaded();
    expect(screen.getByTestId('kiki-case-prep-card')).toBeInTheDocument();
    expect(screen.getByText('Before you start, Kiki would ask:')).toBeInTheDocument();
  });

  it('displays Bulgarian Kiki preparation card (BG)', async () => {
    renderWithLang(
      <Routes>
        <Route path="/cases/:id" element={<CasePreview />} />
      </Routes>,
      {
        lang: 'bg',
        initialEntries: [`/cases/${MOCK_CASE_ID}`],
      },
    );
    await waitForLoaded();
    expect(screen.getByTestId('kiki-case-prep-card')).toBeInTheDocument();
    expect(screen.getByText('Преди да започнеш, Kiki би те попитала:')).toBeInTheDocument();
  });
});
