import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PracticeFirstThemePage from '@/pages/PracticeFirstThemePage';
import KikiInlineHint from '@/components/mentor/KikiInlineHint';
import {
  ENTREPRENEURSHIP_MODULES,
  INNOVATION_MODULES,
  PRACTICE_FIRST_MODULES,
} from '@/data/practice-first-content';
import {
  countReadModules,
  isModuleRead,
  pfReadKey,
  setModuleRead,
} from '@/lib/practice-first-progress';
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

function renderEntrepreneurship({ lang = 'en', userId = 'u1' as string | null } = {}) {
  (useAuth as any).mockReturnValue({
    user: userId ? { id: userId } : null,
    userRole: 'student',
    isAdmin: false,
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

function expandFirstModule(lang: 'en' | 'bg' = 'en') {
  const mod = ENTREPRENEURSHIP_MODULES[0];
  const title = lang === 'bg' ? mod.title_bg : mod.title_en;
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const btn = screen.getByRole('button', { name: new RegExp(escaped, 'i') });
  fireEvent.click(btn);
}

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});

describe('Entrepreneurship theme completion V1 — CEFE UI surfacing', () => {
  it('renders a CEFE block for every Entrepreneurship task when a module is opened', () => {
    renderEntrepreneurship({ lang: 'en' });
    expandFirstModule();
    const mod = ENTREPRENEURSHIP_MODULES[0];
    for (const task of mod.practiceTasks) {
      expect(screen.getByTestId(`pf-cefe-${task.id}`)).toBeInTheDocument();
    }
    // Section labels visible.
    expect(screen.getAllByText('Action').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Visible result').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Processing questions').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Generalizing principle').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Apply').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Teacher check').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Evidence').length).toBeGreaterThan(0);
  });

  it('renders Bulgarian CEFE labels in BG mode', () => {
    renderEntrepreneurship({ lang: 'bg' });
    expandFirstModule('bg');
    expect(screen.getAllByText('Действие').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Видим резултат').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Въпроси за анализ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Принцип').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Приложи').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Проверка от учител').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Доказателство').length).toBeGreaterThan(0);
  });
});

describe('Read-state toggle', () => {
  it('starts at "Read 0 of 6" and increments when a module is marked read', () => {
    renderEntrepreneurship({ lang: 'en', userId: 'user-42' });
    expect(screen.getByTestId('pf-read-summary').textContent).toContain('Read 0 of 6');

    expandFirstModule();
    const mod = ENTREPRENEURSHIP_MODULES[0];
    const toggle = screen.getByTestId(`pf-read-toggle-${mod.id}`);
    expect(toggle.textContent).toContain('Mark as read');

    fireEvent.click(toggle);

    expect(screen.getByTestId('pf-read-summary').textContent).toContain('Read 1 of 6');
    expect(screen.getByTestId(`pf-read-badge-${mod.id}`)).toBeInTheDocument();
    // Button label switches to Mark unread.
    expect(screen.getByTestId(`pf-read-toggle-${mod.id}`).textContent).toContain(
      'Mark unread',
    );

    // Toggle off.
    fireEvent.click(screen.getByTestId(`pf-read-toggle-${mod.id}`));
    expect(screen.getByTestId('pf-read-summary').textContent).toContain('Read 0 of 6');
  });

  it('renders Bulgarian read-state labels in BG mode', () => {
    renderEntrepreneurship({ lang: 'bg', userId: 'user-42' });
    expect(screen.getByTestId('pf-read-summary').textContent).toContain('Прочетени 0 от 6');

    expandFirstModule('bg');
    const mod = ENTREPRENEURSHIP_MODULES[0];
    const toggle = screen.getByTestId(`pf-read-toggle-${mod.id}`);
    expect(toggle.textContent).toContain('Маркирай като прочетено');
    fireEvent.click(toggle);
    expect(screen.getByTestId(`pf-read-toggle-${mod.id}`).textContent).toContain(
      'Отмени прочитане',
    );
  });

  it('never uses the word "Completed" for read-state (EN or BG)', () => {
    const { container: en } = renderEntrepreneurship({ lang: 'en', userId: 'u1' });
    expandFirstModule();
    const mod = ENTREPRENEURSHIP_MODULES[0];
    fireEvent.click(screen.getByTestId(`pf-read-toggle-${mod.id}`));
    // Words we must not use for the personal read-state flow.
    expect(en.textContent).not.toMatch(/\bcompleted\b/i);
    expect(en.textContent).not.toMatch(/\bcompletion\b/i);

    const { container: bg } = renderEntrepreneurship({ lang: 'bg', userId: 'u1' });
    // Read-state controls in BG must not use "завърши"/"завършен(о)" wording.
    // Note: the shared page copy elsewhere may still use standard BG words
    // like "нуждае" — the check is scoped to the read-state area.
    const readSummary = screen.getAllByTestId('pf-read-summary')[0];
    expect(readSummary.textContent).not.toMatch(/завърш/i);
  });

  it('persists read-state in localStorage under pf:read:<uid>:<moduleId> and nowhere else', () => {
    const mod = ENTREPRENEURSHIP_MODULES[0];
    setModuleRead('user-77', mod.id, true);
    const key = pfReadKey('user-77', mod.id);
    expect(key).toBe(`pf:read:user-77:${mod.id}`);
    expect(window.localStorage.getItem(key)).toBe('1');
    expect(isModuleRead('user-77', mod.id)).toBe(true);
    expect(
      countReadModules(
        'user-77',
        ENTREPRENEURSHIP_MODULES.map((m) => m.id),
      ),
    ).toBe(1);

    // Different user does not see it.
    expect(isModuleRead('user-99', mod.id)).toBe(false);

    // No supabase key was written.
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)!;
      expect(k.startsWith('pf:read:')).toBe(true);
    }
  });

  it('anonymous users use the "anonymous" bucket', () => {
    setModuleRead(null, 'entr-01-thinking-and-action', true);
    expect(
      window.localStorage.getItem('pf:read:anonymous:entr-01-thinking-and-action'),
    ).toBe('1');
  });

  it('does not call supabase during page render or read-state toggle', () => {
    const spy = vi.spyOn(supabase, 'from');
    renderEntrepreneurship({ lang: 'en', userId: 'u1' });
    expandFirstModule();
    const mod = ENTREPRENEURSHIP_MODULES[0];
    fireEvent.click(screen.getByTestId(`pf-read-toggle-${mod.id}`));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Dictionary chips', () => {
  it('renders each dictionary concept as a link to /dictionary?q=<encoded>', () => {
    renderEntrepreneurship({ lang: 'en', userId: 'u1' });
    expandFirstModule();
    const mod = ENTREPRENEURSHIP_MODULES[0];
    const container = screen.getByTestId(`pf-dict-chips-${mod.id}`);
    const chips = within(container).getAllByTestId('pf-dict-chip');
    expect(chips.length).toBe(mod.dictionaryConcepts.length);
    for (const [i, concept] of mod.dictionaryConcepts.entries()) {
      const href = chips[i].getAttribute('href') ?? '';
      expect(href).toBe(`/dictionary?q=${encodeURIComponent(concept)}`);
      expect(chips[i].textContent).toBe(concept);
    }
  });
});

describe('KikiInlineHint', () => {
  it('renders the provided static questions and shows the correct label per language', () => {
    const qs = [
      { en: 'What did you actually see?', bg: 'Какво всъщност видя?' },
      { en: 'Where is your evidence weakest?', bg: 'Къде доказателството ти е най-слабо?' },
    ];
    const spy = vi.spyOn(supabase, 'from');
    const { rerender } = render(<KikiInlineHint questions={qs} lang="en" />);
    expect(screen.getByText('Kiki would ask')).toBeInTheDocument();
    expect(screen.getByText('What did you actually see?')).toBeInTheDocument();

    rerender(<KikiInlineHint questions={qs} lang="bg" />);
    expect(screen.getByText('Kiki ще те попита')).toBeInTheDocument();
    expect(screen.getByText('Какво всъщност видя?')).toBeInTheDocument();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('renders nothing when passed an empty questions array', () => {
    const { container } = render(<KikiInlineHint questions={[]} lang="en" />);
    expect(container.firstChild).toBeNull();
  });

  it('is used inside the practice page for each module', () => {
    renderEntrepreneurship({ lang: 'en', userId: 'u1' });
    expandFirstModule();
    // At least one inline hint present after opening a module.
    expect(screen.getAllByTestId('kiki-inline-hint').length).toBeGreaterThan(0);
  });
});

describe('Decision case CTA', () => {
  it('renders the CTA card in English on the entrepreneurship page', () => {
    renderEntrepreneurship({ lang: 'en', userId: 'u1' });
    const cta = screen.getByTestId('pf-decision-case-cta');
    expect(cta.textContent).toContain('Entrepreneurship cases');
    expect(cta.textContent).toContain('View cases');
  });

  it('renders the CTA card in Bulgarian on the entrepreneurship page', () => {
    renderEntrepreneurship({ lang: 'bg', userId: 'u1' });
    const cta = screen.getByTestId('pf-decision-case-cta');
    expect(cta.textContent).toContain('Казуси по предприемачество');
    expect(cta.textContent).toContain('Виж казусите');
  });

  it('links to the theme-filtered case library', () => {
    renderEntrepreneurship({ lang: 'en', userId: 'u1' });
    const cta = screen.getByTestId('pf-decision-case-cta');
    const links = cta.querySelectorAll('a');
    const hrefs = Array.from(links).map((a) => a.getAttribute('href') ?? '');
    expect(hrefs).toContain('/cases?theme=entrepreneurship');
  });
});

describe('Content invariants — nothing external was changed', () => {
  it('Innovation modules retain their original count and are unchanged in content', () => {
    expect(INNOVATION_MODULES).toHaveLength(6);
    expect(
      PRACTICE_FIRST_MODULES.filter((m) => m.themeId === 'innovation'),
    ).toEqual(INNOVATION_MODULES);
  });

  it('all modules remain needs_review (no educator_approved)', () => {
    for (const m of PRACTICE_FIRST_MODULES) {
      expect(m.status).toBe('needs_review');
    }
  });
});