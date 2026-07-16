import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Index from '@/pages/Index';
import AIMentorWidget from '@/components/dashboard/AIMentorWidget';
import StructuredFeedback from '@/components/feedback/StructuredFeedback';
import AIMentorPanel from '@/components/startup/AIMentorPanel';
import PracticeFirstThemePage from '@/pages/PracticeFirstThemePage';
import { LangProvider } from '@/context/LangContext';
import { AuthContext } from '@/context/AuthContext';

// ── Shared supabase mock ────────────────────────────────────────────────
const invokeMock = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => invokeMock(...args) },
  },
}));

beforeEach(() => {
  invokeMock.mockReset();
  localStorage.clear();
});

// ── Landing "Ask Kiki" CTA ──────────────────────────────────────────────
describe('Landing "Ask Kiki" CTA', () => {
  const renderLanding = (user: any = null, lang: 'en' | 'bg' = 'en') => {
    localStorage.setItem('digiinnov-lang', lang);
    return render(
      <MemoryRouter initialEntries={['/']}>
        <AuthContext.Provider
          value={{
            user,
            isLoading: false,
            session: null,
            refreshSession: vi.fn(),
            signOut: vi.fn(),
          } as any}
        >
          <LangProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<div data-testid="dash-route">{location.hash}</div>} />
              <Route path="/auth" element={<div data-testid="auth-route" />} />
            </Routes>
          </LangProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
  };

  it('logged-in "Ask Kiki" click navigates to dashboard with #kiki-mentor anchor', () => {
    renderLanding({ id: 'u1', email: 'a@b.c' });
    const btn = screen.getByRole('button', { name: /Ask Kiki/i });
    fireEvent.click(btn);
    // We should now be on the dashboard route stub.
    expect(screen.getByTestId('dash-route')).toBeInTheDocument();
    // React Router keeps the hash on window.location.
    expect(window.location.hash).toBe('#kiki-mentor');
  });

  it('logged-out "Ask Kiki" click goes to /auth', () => {
    renderLanding(null);
    const btn = screen.getByRole('button', { name: /Ask Kiki/i });
    fireEvent.click(btn);
    expect(screen.getByTestId('auth-route')).toBeInTheDocument();
  });
});

// ── AIMentorWidget empty-data guard ─────────────────────────────────────
describe('AIMentorWidget empty-data guard', () => {
  it('does not call ai-feedback when startup data is empty', () => {
    render(<AIMentorWidget lang="en" startupData={{}} />);
    const btn = screen.getByRole('button', { name: /Ask Kiki for feedback/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(invokeMock).not.toHaveBeenCalled();
    // Guard message visible.
    expect(
      screen.getByText(/Add at least part of your project/i),
    ).toBeInTheDocument();
  });

  it('does not call ai-feedback when only one short field is filled', () => {
    render(
      <AIMentorWidget
        lang="en"
        startupData={{ problem: 'too short', customer: '' }}
      />,
    );
    const btn = screen.getByRole('button', { name: /Ask Kiki for feedback/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it('calls ai-feedback once startup data has 2+ meaningful fields', async () => {
    invokeMock.mockResolvedValueOnce({ data: { feedback: 'ok' }, error: null });
    render(
      <AIMentorWidget
        lang="en"
        startupData={{
          problem: 'Students struggle to test ideas with real users quickly.',
          customer: 'Bulgarian high-schoolers building side projects for the first time.',
        }}
      />,
    );
    const btn = screen.getByRole('button', { name: /Ask Kiki for feedback/i });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(invokeMock).toHaveBeenCalledTimes(1);
    expect(invokeMock).toHaveBeenCalledWith(
      'ai-feedback',
      expect.objectContaining({ body: expect.objectContaining({ type: 'startup_project' }) }),
    );
  });

  it('shows BG guard message in Bulgarian', () => {
    render(<AIMentorWidget lang="bg" startupData={{}} />);
    expect(
      screen.getByText(/Попълни поне част от проекта си/i),
    ).toBeInTheDocument();
  });
});

// ── StructuredFeedback label ────────────────────────────────────────────
describe('StructuredFeedback Kiki naming', () => {
  const ctx = {
    type: 'startup_project',
    problem: 'p',
    customer: 'c',
    valueProp: 'v',
    businessModel: 'b',
    growthStrategy: 'g',
    finalPitch: 'f',
  } as const;

  it('renders "Kiki feedback" header (EN)', () => {
    render(<StructuredFeedback lang="en" context={ctx as any} />);
    expect(screen.getByText('Kiki feedback')).toBeInTheDocument();
    expect(screen.queryByText(/AI Learning Feedback/i)).toBeNull();
  });

  it('renders "Обратна връзка от Kiki" header (BG)', () => {
    render(<StructuredFeedback lang="bg" context={ctx as any} />);
    expect(screen.getByText('Обратна връзка от Kiki')).toBeInTheDocument();
  });

  it('button reads "Ask Kiki for feedback" / "Поискай обратна връзка от Kiki"', () => {
    const { rerender } = render(<StructuredFeedback lang="en" context={ctx as any} />);
    expect(
      screen.getByRole('button', { name: /Ask Kiki for feedback/i }),
    ).toBeInTheDocument();
    rerender(<StructuredFeedback lang="bg" context={ctx as any} />);
    expect(
      screen.getByRole('button', { name: /Поискай обратна връзка от Kiki/i }),
    ).toBeInTheDocument();
  });
});

// ── AIMentorPanel BMC ───────────────────────────────────────────────────
describe('AIMentorPanel (BMC) Kiki naming', () => {
  const bmc = {
    bmc_customer_segments: '',
    bmc_value_proposition: '',
    bmc_channels: '',
    bmc_customer_relationships: '',
    bmc_revenue_streams: '',
    bmc_key_resources: '',
    bmc_key_activities: '',
    bmc_key_partners: '',
    bmc_cost_structure: '',
  } as any;

  it('renders "Kiki BMC review" (EN) and subtitle', () => {
    render(<AIMentorPanel data={bmc} lang="en" />);
    expect(screen.getByText('Kiki BMC review')).toBeInTheDocument();
    expect(
      screen.getByText(/Get Kiki's feedback on your Business Model Canvas/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/AI Startup Mentor/)).toBeNull();
  });

  it('renders "BMC преглед от Kiki" (BG)', () => {
    render(<AIMentorPanel data={bmc} lang="bg" />);
    expect(screen.getByText('BMC преглед от Kiki')).toBeInTheDocument();
  });
});

// ── Practice-first mentor questions label ───────────────────────────────
vi.mock('@/context/AuthContext', async () => {
  const actual = await vi.importActual<any>('@/context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(() => ({ userRole: 'student', isAdmin: false, user: null })),
  };
});
vi.mock('@/context/LangContext', async () => {
  const actual = await vi.importActual<any>('@/context/LangContext');
  return { ...actual, useLang: vi.fn(() => ({ lang: 'en' })) };
});
vi.mock('@/components/layout/AppHeader', () => ({ default: () => <div /> }));

import { useLang } from '@/context/LangContext';

describe('PracticeFirstThemePage — Kiki questions label and note', () => {
  const renderPage = (lang: 'en' | 'bg' = 'en') => {
    (useLang as any).mockReturnValue({ lang });
    return render(
      <MemoryRouter initialEntries={['/learn/practice/entrepreneurship']}>
        <Routes>
          <Route
            path="/learn/practice/:themeId"
            element={<PracticeFirstThemePage />}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('shows "Mentor questions from Kiki" and the not-automatic note (EN)', () => {
    const { container } = renderPage('en');
    expect(container.textContent).toMatch(/Mentor questions from Kiki/);
    expect(container.textContent).toMatch(
      /Kiki does not respond automatically here yet/,
    );
  });

  it('shows "Менторски въпроси от Kiki" and BG note', () => {
    const { container } = renderPage('bg');
    expect(container.textContent).toMatch(/Менторски въпроси от Kiki/);
    expect(container.textContent).toMatch(
      /Тук Kiki не отговаря автоматично/,
    );
  });
});
