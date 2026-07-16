import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PracticeFirstThemePage from '@/pages/PracticeFirstThemePage';
import { ENTREPRENEURSHIP_MODULES, PRACTICE_FIRST_MODULES } from '@/data/practice-first-content';

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

function renderPage({ lang = 'en', role = 'student', isAdmin = false } = {}) {
  (useAuth as any).mockReturnValue({ userRole: role, isAdmin });
  (useLang as any).mockReturnValue({ lang });
  return render(
    <MemoryRouter initialEntries={['/learn/practice/entrepreneurship']}>
      <Routes>
        <Route path="/learn/practice/:themeId" element={<PracticeFirstThemePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Practice-first mobile readability polish V1', () => {
  it('shows EN draft badge as "Draft / for review" to reviewers only', () => {
    renderPage({ lang: 'en', role: 'teacher_verified' });
    expect(screen.getByText('Draft / for review')).toBeInTheDocument();
  });

  it('shows BG draft badge as "Чернова / за преглед" to reviewers only', () => {
    renderPage({ lang: 'bg', role: 'teacher_verified' });
    expect(screen.getByText('Чернова / за преглед')).toBeInTheDocument();
    expect(screen.queryByText(/Draft \/ За преглед/)).toBeNull();
  });

  it('hides draft/review labels from student learners', () => {
    const { container } = renderPage({ lang: 'bg', role: 'student' });
    expect(container.textContent).not.toMatch(/Чернова/);
    expect(container.textContent).not.toMatch(/за преглед/);
    const en = renderPage({ lang: 'en', role: 'student' });
    expect(en.container.textContent).not.toMatch(/\bDraft\b/);
    expect(en.container.textContent).not.toMatch(/for review/i);
    expect(en.container.textContent).not.toMatch(/needs_review/);
    expect(en.container.textContent).not.toMatch(/needs_content_review/);
    expect(en.container.textContent).not.toMatch(/content review/i);
  });

  it('does not expose raw "needs_review" in user-facing copy', () => {
    const { container } = renderPage({ lang: 'en' });
    expect(container.textContent).not.toMatch(/needs_review/);
    const bg = renderPage({ lang: 'bg' });
    expect(bg.container.textContent).not.toMatch(/needs_review/);
  });

  it('module titles do not use the truncate class', () => {
    const { container } = renderPage({ lang: 'en' });
    const truncated = container.querySelectorAll('.truncate');
    expect(truncated.length).toBe(0);
  });

  it('reviewer note is hidden for regular students', () => {
    renderPage({ lang: 'bg', role: 'student', isAdmin: false });
    expect(screen.queryByText(/рецензент/)).toBeNull();
  });

  it('reviewer note renders for teacher_verified and admins', () => {
    renderPage({ lang: 'bg', role: 'teacher_verified' });
    expect(screen.getByText(/рецензент/)).toBeInTheDocument();
  });

  it('renders all 6 entrepreneurship modules', () => {
    renderPage({ lang: 'en' });
    for (const m of ENTREPRENEURSHIP_MODULES) {
      expect(screen.getByText(m.title_en)).toBeInTheDocument();
    }
  });

  it('all practice-first content remains needs_review (none educator_approved)', () => {
    expect(PRACTICE_FIRST_MODULES.every((m) => m.status === 'needs_review')).toBe(true);
  });
});
