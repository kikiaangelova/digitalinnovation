import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PracticeFirstThemePage from '@/pages/PracticeFirstThemePage';
import { ENTREPRENEURSHIP_MODULES, INNOVATION_MODULES, PRACTICE_FIRST_MODULES } from '@/data/practice-first-content';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/context/LangContext', () => ({
  useLang: vi.fn(),
  LangProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/components/layout/AppHeader', () => ({
  default: () => <div data-testid="hdr" />,
}));

import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

function renderPage({ lang = 'en', role = 'student' as string | undefined, isAdmin = false, userId = 'u1' as string | null } = {}) {
  (useAuth as any).mockReturnValue({
    user: userId ? { id: userId } : null,
    userRole: role,
    isAdmin,
  });
  (useLang as any).mockReturnValue({ lang });
  return render(
    <MemoryRouter initialEntries={['/learn/practice/entrepreneurship']}>
      <Routes>
        <Route path="/learn/practice/:themeId" element={<PracticeFirstThemePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function expandAll() {
  for (const mod of ENTREPRENEURSHIP_MODULES) {
    const escaped = mod.title_en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const btn = screen.getByRole('button', { name: new RegExp(escaped, 'i') });
    fireEvent.click(btn);
  }
}

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});

describe('Learner-facing polish V1', () => {
  it('hides draft/review internal labels from students (EN + BG)', () => {
    const { container } = renderPage({ lang: 'en', role: 'student' });
    expandAll();
    const txt = container.textContent ?? '';
    expect(txt).not.toMatch(/\bDraft\b/);
    expect(txt).not.toMatch(/for review/i);
    expect(txt).not.toMatch(/needs_review/);
    expect(txt).not.toMatch(/needs_content_review/);
    expect(txt).not.toMatch(/content review/i);

    const bg = renderPage({ lang: 'bg', role: 'student' });
    expandAll();
    const btxt = bg.container.textContent ?? '';
    expect(btxt).not.toMatch(/Чернова/);
    expect(btxt).not.toMatch(/за преглед/);
  });

  it('hides draft/review labels when role is undefined', () => {
    const { container } = renderPage({ lang: 'en', role: undefined });
    expect(container.textContent).not.toMatch(/\bDraft\b/);
    expect(container.textContent).not.toMatch(/for review/i);
  });

  it('reviewer (teacher_verified) still sees internal review info', () => {
    renderPage({ lang: 'en', role: 'teacher_verified' });
    expect(screen.getByText('Draft / for review')).toBeInTheDocument();
    expandAll();
    // At least one case connection shows the reviewer-only "needs content review" tag.
    expect(screen.getAllByText(/needs content review/i).length).toBeGreaterThan(0);
  });

  it('renders friendly case labels and never raw case IDs to learners', () => {
    const { container } = renderPage({ lang: 'en', role: 'student' });
    expandAll();
    const txt = container.textContent ?? '';
    for (const raw of [
      'school-youth-environment',
      'food-waste-sustainability',
      'chatgpt-ai-business-model',
      'revolut-fintech',
      'fashion-business',
      'small-business',
    ]) {
      expect(txt).not.toContain(raw);
    }
    expect(txt).toContain('Case: problem in a familiar environment');
    expect(txt).toContain('Case: fintech value and business model');
  });

  it('renders Bulgarian friendly case labels to learners', () => {
    const { container } = renderPage({ lang: 'bg', role: 'student' });
    expandAll();
    const txt = container.textContent ?? '';
    expect(txt).toContain('Казус: проблем в позната среда');
    expect(txt).toContain('Казус: финтех стойност и бизнес модел');
  });

  it('Kiki section shows only 2 questions by default and toggles to reveal the rest', () => {
    renderPage({ lang: 'en', role: 'student' });
    const mod = ENTREPRENEURSHIP_MODULES[0];
    expect(mod.kikiQuestions.length).toBeGreaterThan(2);
    const escaped = mod.title_en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    fireEvent.click(screen.getByRole('button', { name: new RegExp(escaped, 'i') }));

    // Renamed section heading
    expect(screen.getAllByText('Check your thinking').length).toBeGreaterThan(0);

    const hints = screen.getAllByTestId('kiki-inline-hint');
    const firstHint = hints[0];
    expect(within(firstHint).getAllByRole('listitem').length).toBe(2);

    const toggle = screen.getByTestId(`pf-kiki-toggle-${mod.id}`);
    expect(toggle.textContent).toContain('Show more questions');
    fireEvent.click(toggle);

    const expandedHints = screen.getAllByTestId('kiki-inline-hint');
    expect(within(expandedHints[0]).getAllByRole('listitem').length).toBe(
      mod.kikiQuestions.length,
    );
    expect(screen.getByTestId(`pf-kiki-toggle-${mod.id}`).textContent).toContain(
      'Hide extra questions',
    );
  });

  it('Kiki toggle uses Bulgarian copy in BG mode', () => {
    renderPage({ lang: 'bg', role: 'student' });
    const mod = ENTREPRENEURSHIP_MODULES[0];
    const escaped = mod.title_bg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    fireEvent.click(screen.getByRole('button', { name: new RegExp(escaped, 'i') }));
    expect(screen.getAllByText('Провери мисленето си').length).toBeGreaterThan(0);
    const toggle = screen.getByTestId(`pf-kiki-toggle-${mod.id}`);
    expect(toggle.textContent).toContain('Покажи още въпроси');
    fireEvent.click(toggle);
    expect(screen.getByTestId(`pf-kiki-toggle-${mod.id}`).textContent).toContain(
      'Скрий допълнителните въпроси',
    );
  });

  it('does not call supabase (no AI/API) during learner view', () => {
    const spy = vi.spyOn(supabase, 'from');
    renderPage({ lang: 'en', role: 'student' });
    expandAll();
    const mod = ENTREPRENEURSHIP_MODULES[0];
    fireEvent.click(screen.getByTestId(`pf-kiki-toggle-${mod.id}`));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('Innovation modules are untouched and all content stays needs_review', () => {
    expect(INNOVATION_MODULES).toHaveLength(6);
    expect(PRACTICE_FIRST_MODULES.every((m) => m.status === 'needs_review')).toBe(true);
  });
});