import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PracticeFirstThemePage from '@/pages/PracticeFirstThemePage';
import SubjectDetail from '@/pages/SubjectDetail';
import {
  INNOVATION_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/context/LangContext', () => ({
  useLang: vi.fn(),
  LangProvider: ({ children }: { children: React.ReactNode }) => children,
  useTranslation: vi.fn(),
}));

vi.mock('@/hooks/useModuleCatalog', () => ({
  useModuleCatalog: vi.fn(),
}));

vi.mock('@/hooks/useMySubjects', () => ({
  useMySubjects: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => {
      const query: any = {
        select: () => query,
        eq: () => query,
        then: (resolve: any, reject: any) =>
          Promise.resolve({ data: [], error: null }).then(resolve, reject),
      };
      return query;
    },
  },
}));

const mockAuth = {
  user: { id: 'u1' },
  userRole: 'student',
  isAdmin: false,
  loading: false,
  authLoading: false,
  roleLoading: false,
};

async function setupMocks(lang: 'en' | 'bg') {
  const { useAuth } = await import('@/context/AuthContext');
  const { useLang } = await import('@/context/LangContext');
  const { useModuleCatalog } = await import('@/hooks/useModuleCatalog');
  const { useMySubjects } = await import('@/hooks/useMySubjects');
  (useAuth as any).mockReturnValue(mockAuth);
  (useLang as any).mockReturnValue({ lang, setLang: vi.fn(), t: {} });
  (useModuleCatalog as any).mockReturnValue({
    catalog: [],
    bySlug: new Map(),
    forSubject: () => [] as any[],
    loading: false,
    error: null,
  });
  (useMySubjects as any).mockReturnValue({
    entries: [],
    allAssignments: [],
    loading: false,
    error: null,
    refresh: vi.fn(),
  });
}

async function renderInnovationTheme(lang: 'en' | 'bg') {
  await setupMocks(lang);
  return render(
    <MemoryRouter initialEntries={['/learn/practice/innovation']}>
      <Routes>
        <Route path="/learn/practice/:themeId" element={<PracticeFirstThemePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function renderEntrepreneurshipTheme(lang: 'en' | 'bg') {
  await setupMocks(lang);
  return render(
    <MemoryRouter initialEntries={['/learn/practice/entrepreneurship']}>
      <Routes>
        <Route path="/learn/practice/:themeId" element={<PracticeFirstThemePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function renderInnovationSubject(lang: 'en' | 'bg') {
  await setupMocks(lang);
  return render(
    <MemoryRouter initialEntries={['/learn/subject/digital-innovation']}>
      <Routes>
        <Route path="/learn/subject/:subjectKey" element={<SubjectDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Innovation UI surfacing V1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('/learn/practice/innovation renders the Innovation theme title (EN)', async () => {
    await renderInnovationTheme('en');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /Innovation/i }),
      ).toBeInTheDocument();
    });
  });

  it('/learn/practice/innovation renders the Innovation theme title (BG)', async () => {
    await renderInnovationTheme('bg');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /Иновации/i }),
      ).toBeInTheDocument();
    });
  });

  it('renders all 6 Innovation modules', async () => {
    await renderInnovationTheme('en');
    await waitFor(() => {
      for (const mod of INNOVATION_MODULES) {
        expect(screen.getByText(mod.title_en)).toBeInTheDocument();
      }
    });
  });

  it('shows the BG draft badge "Чернова / за преглед"', async () => {
    await renderInnovationTheme('bg');
    await waitFor(() => {
      expect(screen.getAllByText(/Чернова \/ за преглед/i).length).toBeGreaterThan(0);
    });
  });

  it('shows the EN draft badge "Draft / for review"', async () => {
    await renderInnovationTheme('en');
    await waitFor(() => {
      expect(screen.getAllByText(/Draft \/ for review/i).length).toBeGreaterThan(0);
    });
  });

  it('never renders raw "needs_review"', async () => {
    await renderInnovationTheme('en');
    await waitFor(() => {
      expect(screen.queryByText(/needs_review/)).toBeNull();
    });
  });

  it('Innovation subject bridge links to /learn/practice/innovation (EN)', async () => {
    await renderInnovationSubject('en');
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /Open practice-first modules/i });
      expect(link).toHaveAttribute('href', '/learn/practice/innovation');
    });
  });

  it('Innovation subject bridge links to /learn/practice/innovation (BG)', async () => {
    await renderInnovationSubject('bg');
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /Отвори практическите модули/i });
      expect(link).toHaveAttribute('href', '/learn/practice/innovation');
    });
  });

  it('Entrepreneurship practice page still works', async () => {
    await renderEntrepreneurshipTheme('en');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /Entrepreneurship/i }),
      ).toBeInTheDocument();
    });
  });

  it('no practice-first content is marked educator_approved', () => {
    expect(
      PRACTICE_FIRST_MODULES.some((m) => m.status === 'educator_approved'),
    ).toBe(false);
  });

  it('all Innovation modules remain needs_review', () => {
    for (const m of INNOVATION_MODULES) {
      expect(m.status).toBe('needs_review');
    }
  });
});