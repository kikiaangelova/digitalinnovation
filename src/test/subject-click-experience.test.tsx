import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SubjectDetail from '@/pages/SubjectDetail';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/context/LangContext', () => ({
  useLang: vi.fn(),
  LangProvider: ({ children }: { children: React.ReactNode }) => children,
  useTranslation: vi.fn(),
}));
vi.mock('@/hooks/useModuleCatalog', () => ({ useModuleCatalog: vi.fn() }));
vi.mock('@/hooks/useMySubjects', () => ({ useMySubjects: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => {
      const q: any = {
        select: () => q, eq: () => q,
        then: (r: any, j: any) => Promise.resolve({ data: [], error: null }).then(r, j),
      };
      return q;
    },
  },
}));

async function setup(lang: 'en' | 'bg') {
  const { useAuth } = await import('@/context/AuthContext');
  const { useLang } = await import('@/context/LangContext');
  const { useModuleCatalog } = await import('@/hooks/useModuleCatalog');
  const { useMySubjects } = await import('@/hooks/useMySubjects');
  (useAuth as any).mockReturnValue({ user: { id: 'u1' }, userRole: 'student', loading: false });
  (useLang as any).mockReturnValue({ lang, setLang: vi.fn(), t: {} });
  (useModuleCatalog as any).mockReturnValue({
    catalog: [], bySlug: new Map(), forSubject: () => [], loading: false, error: null,
  });
  (useMySubjects as any).mockReturnValue({
    entries: [], allAssignments: [], loading: false, error: null, refresh: vi.fn(),
  });
}

async function renderSubject(key: string, lang: 'en' | 'bg') {
  await setup(lang);
  return render(
    <MemoryRouter initialEntries={[`/learn/subject/${key}`]}>
      <Routes>
        <Route path="/learn/subject/:subjectKey" element={<SubjectDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Subject click experience — process preview', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows process preview instead of dead empty state for a preview subject (EN)', async () => {
    // Use design-thinking: a preview subject that has no dedicated practice-first bridge,
    // so it should fall through to the generic subject process preview.
    // marketing-foundations now bridges to /learn/practice/marketing (see marketing bridge test below).
    await renderSubject('design-thinking', 'en');
    await waitFor(() => {
      expect(screen.getByTestId('subject-process-preview')).toBeInTheDocument();
    });
    expect(screen.getByText(/How you will work in this subject/i)).toBeInTheDocument();
    expect(screen.getByText(/What you will do in practice/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills you will evidence/i)).toBeInTheDocument();
    expect(screen.getByText(/Content status/i)).toBeInTheDocument();
    // Must NOT show the old dead empty state alone.
    expect(screen.queryByText(/Learning content for this subject is being prepared\./i)).not.toBeInTheDocument();
  });

  it('shows Bulgarian process preview labels for a planned subject', async () => {
    await renderSubject('blue-ocean-strategy', 'bg');
    await waitFor(() => {
      expect(screen.getByTestId('subject-process-preview')).toBeInTheDocument();
    });
    expect(screen.getByText(/Как ще работиш по този предмет/i)).toBeInTheDocument();
    expect(screen.getByText(/Какво ще правиш на практика/i)).toBeInTheDocument();
    expect(screen.getByText(/Понятия, които ще срещнеш/i)).toBeInTheDocument();
    expect(screen.getByText(/Статус на съдържанието/i)).toBeInTheDocument();
    // Status badge must be visible for planned/preview.
    expect(screen.getAllByText(/Планирано|В процес на подготовка/i).length).toBeGreaterThan(0);
  });

  it('planned subject still exposes next actions (Dictionary + Cases + Back)', async () => {
    await renderSubject('agile', 'en');
    await waitFor(() => {
      expect(screen.getByTestId('subject-process-preview')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /Open Dictionary/i })).toHaveAttribute('href', '/dictionary');
    expect(screen.getByRole('link', { name: /Browse Cases/i })).toHaveAttribute('href', '/cases');
    expect(screen.getByRole('link', { name: /Back to My Subjects/i })).toHaveAttribute('href', '/learn');
  });

  it('entrepreneurship keeps its bridge card, not the generic process preview', async () => {
    await renderSubject('entrepreneurship-startups', 'en');
    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Open practice-first modules/i }),
      ).toHaveAttribute('href', '/learn/practice/entrepreneurship');
    });
    expect(screen.queryByTestId('subject-process-preview')).not.toBeInTheDocument();
  });

  it('marketing-foundations bridges to the shared Marketing practice-first path', async () => {
    await renderSubject('marketing-foundations', 'en');
    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Open practice-first modules/i }),
      ).toHaveAttribute('href', '/learn/practice/marketing');
    });
    expect(screen.queryByTestId('subject-process-preview')).not.toBeInTheDocument();
  });

  it('digital-marketing bridges to the same shared Marketing practice-first path', async () => {
    await renderSubject('digital-marketing', 'en');
    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Open practice-first modules/i }),
      ).toHaveAttribute('href', '/learn/practice/marketing');
    });
  });
});
