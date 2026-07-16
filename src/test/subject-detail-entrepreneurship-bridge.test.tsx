import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubjectDetail from '@/pages/SubjectDetail';
import { PRACTICE_FIRST_MODULES } from '@/data/practice-first-content';

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

const mockCatalog = {
  catalog: [],
  bySlug: new Map(),
  forSubject: () => [] as any[],
  loading: false,
  error: null,
};

const mockMySubjects = {
  entries: [] as any[],
  allAssignments: [] as any[],
  loading: false,
  error: null,
  refresh: vi.fn(),
};

async function setup(lang: 'en' | 'bg') {
  const { useAuth } = await import('@/context/AuthContext');
  const { useLang } = await import('@/context/LangContext');
  const { useModuleCatalog } = await import('@/hooks/useModuleCatalog');
  const { useMySubjects } = await import('@/hooks/useMySubjects');

  (useAuth as any).mockReturnValue(mockAuth);
  (useLang as any).mockReturnValue({ lang, setLang: vi.fn(), t: {} });
  (useModuleCatalog as any).mockReturnValue(mockCatalog);
  (useMySubjects as any).mockReturnValue(mockMySubjects);
}

// Dynamic import helper so we can set mocks before each render.
async function renderEntrepreneurship(lang: 'en' | 'bg') {
  await setup(lang);
  return render(
    <MemoryRouter initialEntries={['/learn/subject/entrepreneurship-startups']}>
      <SubjectDetail />
    </MemoryRouter>,
  );
}

describe('Entrepreneurship subject detail bridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the entrepreneurship subject title in English', async () => {
    await renderEntrepreneurship('en');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Entrepreneurship & Entrepreneurial Thinking/i,
        }),
      ).toBeInTheDocument();
    });
  });

  it('shows the entrepreneurship subject title in Bulgarian', async () => {
    await renderEntrepreneurship('bg');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Предприемачество и предприемаческо мислене/i,
        }),
      ).toBeInTheDocument();
    });
  });

  it('links to the Entrepreneurship practice-first draft modules', async () => {
    await renderEntrepreneurship('en');
    await waitFor(() => {
      const link = screen.getByRole('link', {
        name: /Open practice-first modules/i,
      });
      expect(link).toHaveAttribute('href', '/learn/practice/entrepreneurship');
    });
  });

  it('shows the Bulgarian CTA and route for the draft modules', async () => {
    await renderEntrepreneurship('bg');
    await waitFor(() => {
      const link = screen.getByRole('link', {
        name: /Отвори практическите модули/i,
      });
      expect(link).toHaveAttribute('href', '/learn/practice/entrepreneurship');
    });
  });

  it('surfaces the draft / for review status in English and Bulgarian', async () => {
    await renderEntrepreneurship('en');
    await waitFor(() => {
      expect(screen.getByText(/Status: draft \/ for review/i)).toBeInTheDocument();
    });

    vi.clearAllMocks();
    await renderEntrepreneurship('bg');
    await waitFor(() => {
      expect(screen.getByText(/Статус: чернова \/ за преглед/i)).toBeInTheDocument();
    });
  });

  it('does not introduce any educator-approved practice-first content', () => {
    const approved = PRACTICE_FIRST_MODULES.some(
      (m) => m.status === 'educator_approved',
    );
    expect(approved).toBe(false);
  });
});
