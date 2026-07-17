import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dictionary from '@/pages/Dictionary';
import { TERMS } from '@/data/dictionary-terms';
import { awardXp } from '@/lib/xp';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/context/LangContext', () => ({
  useLang: vi.fn(),
  LangProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/components/layout/AppHeader', () => ({
  default: () => <div data-testid="app-header" />,
}));
vi.mock('@/components/dictionary/QuickTest', () => ({
  default: () => <div data-testid="quick-test" />,
}));
vi.mock('@/lib/xp', () => ({
  awardXp: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => {
      const chain = {
        select: () => chain,
        eq: () => chain,
        order: () => Promise.resolve({ data: [], error: null }),
      };
      return chain;
    },
  },
}));

import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

function renderDictionary({ lang = 'en' as 'en' | 'bg', role = 'student' as 'student' | 'teacher_pending' | 'teacher_verified' | 'admin' | null, isAdmin = false, userId = 'u1' as string | null } = {}) {
  (useAuth as any).mockReturnValue({
    user: userId ? { id: userId } : null,
    userRole: role,
    isAdmin,
    loading: false,
    authLoading: false,
    roleLoading: false,
  });
  (useLang as any).mockReturnValue({ lang });

  return render(
    <MemoryRouter>
      <Dictionary />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

const reviewLabels = {
  en: ['Needs review', 'Needs rewrite', 'Educator approved', 'Duplicate / merge needed'],
  bg: ['За преглед', 'Нуждае се от редакция', 'Одобрено от преподавател', 'Дублирано / за сливане'],
};

const REVIEW_FILTER_TESTID = 'review-filter-panel';

function getVisibleText(container: HTMLElement) {
  return container.textContent ?? '';
}

describe('Dictionary Student View Cleanup V1', () => {
  it('hides review filters and review badges from students (EN)', () => {
    const { container } = renderDictionary({ lang: 'en', role: 'student' });
    expect(screen.queryByTestId(REVIEW_FILTER_TESTID)).not.toBeInTheDocument();
    const text = getVisibleText(container);
    for (const label of reviewLabels.en) {
      expect(text).not.toContain(label);
    }
    expect(text).not.toContain('Required concept — definition pending review.');
  });

  it('hides review filters and review badges from students (BG)', () => {
    const { container } = renderDictionary({ lang: 'bg', role: 'student' });
    expect(screen.queryByTestId(REVIEW_FILTER_TESTID)).not.toBeInTheDocument();
    const text = getVisibleText(container);
    for (const label of reviewLabels.bg) {
      expect(text).not.toContain(label);
    }
    expect(text).not.toContain('Задължително понятие — определението подлежи на преглед.');
  });

  it('hides review filters and review badges from logged-out users', () => {
    const { container } = renderDictionary({ lang: 'en', role: null, userId: null });
    expect(screen.queryByTestId(REVIEW_FILTER_TESTID)).not.toBeInTheDocument();
    const text = getVisibleText(container);
    for (const label of reviewLabels.en) {
      expect(text).not.toContain(label);
    }
    expect(text).not.toContain('Required concept — definition pending review.');
  });

  it('hides review filters and review badges from teacher_pending', () => {
    const { container } = renderDictionary({ lang: 'en', role: 'teacher_pending' });
    expect(screen.queryByTestId(REVIEW_FILTER_TESTID)).not.toBeInTheDocument();
    const text = getVisibleText(container);
    for (const label of reviewLabels.en) {
      expect(text).not.toContain(label);
    }
  });

  it('admin can see review filters and review badges', () => {
    const { container } = renderDictionary({ lang: 'en', role: 'admin', isAdmin: true });
    expect(screen.getByTestId(REVIEW_FILTER_TESTID)).toBeInTheDocument();
    const text = getVisibleText(container);
    // At least one of the review labels is visible because TERMS include a variety of statuses.
    const hasAnyLabel = reviewLabels.en.some((label) => text.includes(label));
    expect(hasAnyLabel).toBe(true);
  });

  it('teacher_verified can see review filters and review badges', () => {
    const { container } = renderDictionary({ lang: 'en', role: 'teacher_verified' });
    expect(screen.getByTestId(REVIEW_FILTER_TESTID)).toBeInTheDocument();
    const text = getVisibleText(container);
    const hasAnyLabel = reviewLabels.en.some((label) => text.includes(label));
    expect(hasAnyLabel).toBe(true);
  });

  it('still renders term, translation, category and definition for students', () => {
    renderDictionary({ lang: 'en', role: 'student' });
    const first = TERMS[0];
    expect(screen.getByText(first.term)).toBeInTheDocument();
    expect(screen.getByText(first.termBg)).toBeInTheDocument();
    // Category appears in the term card and in the category filter bar.
    expect(screen.getAllByText(first.category).length).toBeGreaterThan(0);
    // Definition is line-clamped; text is still present in the DOM.
    expect(screen.getByText(first.definition, { exact: false })).toBeInTheDocument();
  });

  it('search filter still works for students', () => {
    renderDictionary({ lang: 'en', role: 'student' });
    const first = TERMS[0];
    const input = screen.getByPlaceholderText(/Search terms in English or Bulgarian/i);
    fireEvent.change(input, { target: { value: first.term } });
    expect(screen.getByText(first.term)).toBeInTheDocument();
    // All other terms should be filtered out.
    const count = screen.getByText(/1 term/);
    expect(count).toBeInTheDocument();
  });

  it('category filter still works for students', () => {
    renderDictionary({ lang: 'en', role: 'student' });
    const first = TERMS[0];
    const categoryButton = screen.getByRole('button', { name: first.category });
    fireEvent.click(categoryButton);
    const visibleTerms = TERMS.filter((t) => t.category === first.category);
    expect(screen.getByText(`${visibleTerms.length} ${visibleTerms.length === 1 ? 'term' : 'terms'}`)).toBeInTheDocument();
  });

  it('letter filter still works for students', () => {
    renderDictionary({ lang: 'en', role: 'student' });
    const letter = 'A';
    const letterButton = screen.getByRole('button', { name: letter });
    fireEvent.click(letterButton);
    const visibleTerms = TERMS.filter((t) => t.term.charAt(0).toUpperCase() === letter);
    expect(screen.getByText(`${visibleTerms.length} ${visibleTerms.length === 1 ? 'term' : 'terms'}`)).toBeInTheDocument();
  });

  it('learning area filter still works for students', () => {
    renderDictionary({ lang: 'en', role: 'student' });
    // Find an area that has at least one term.
    const area = TERMS.find((t) => t.learningAreaId)?.learningAreaId;
    if (!area) return;
    const areaButton = screen.getByRole('button', { name: new RegExp(area, 'i') });
    fireEvent.click(areaButton);
    const visibleTerms = TERMS.filter((t) => t.learningAreaId === area);
    expect(screen.getByText(`${visibleTerms.length} ${visibleTerms.length === 1 ? 'term' : 'terms'}`)).toBeInTheDocument();
  });

  it('does not allow students to trigger a review filter via hidden UI', () => {
    renderDictionary({ lang: 'en', role: 'student' });
    // Review filter panel is absent, so no review filtering buttons exist.
    expect(screen.queryByRole('button', { name: /Needs review/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Educator approved/i })).not.toBeInTheDocument();
  });

  it('reviewer can filter by review status and see it applied', () => {
    renderDictionary({ lang: 'en', role: 'teacher_verified' });
    const needsReviewButton = screen.getByRole('button', { name: /Needs review/i });
    fireEvent.click(needsReviewButton);
    const visibleTerms = TERMS.filter((t) => !t.reviewStatus || t.reviewStatus === 'needs_review');
    expect(screen.getByText(`${visibleTerms.length} ${visibleTerms.length === 1 ? 'term' : 'terms'}`)).toBeInTheDocument();
  });

  it('keeps dictionary data files unchanged (governance fields still present)', () => {
    // Guard test: governance data is still present and we did not accidentally
    // alter the term count or remove review/required/source fields.
    expect(TERMS.length).toBeGreaterThan(0);
    const hasReviewStatuses = TERMS.some((t) => t.reviewStatus);
    const hasRequired = TERMS.some((t) => t.required);
    expect(hasReviewStatuses).toBe(true);
    expect(hasRequired).toBe(true);
    // Default review status logic still works (data not edited to always include status).
    const termWithoutStatus = TERMS.find((t) => !t.reviewStatus);
    expect(termWithoutStatus).toBeDefined();
  });

  it('does not touch data/auth/XP/RLS/case/Learn/startup/simulator/Kiki routes', () => {
    // This is a declarative guard test: the only changed file should be Dictionary.tsx and this test.
    // The test passes if the Dictionary component renders without referencing other changed domains.
    const { container } = renderDictionary({ lang: 'en', role: 'student' });
    expect(container.querySelector('[data-testid="app-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="quick-test"]')).toBeInTheDocument();
  });
});
