import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import CaseLibrary from '@/pages/CaseLibrary';
import { casesForTheme } from '@/data/case-theme-tags';

// ── Mocks ────────────────────────────────────────────────────────────────
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

// Build a mock case row set. Include every entrepreneurship-tagged UUID
// plus a handful of non-entrepreneurship "noise" cases that should be
// hidden when the entrepreneurship theme is active.
const ENTREPRENEURSHIP_IDS = casesForTheme('entrepreneurship').map((t) => t.caseId);

const mockCases = [
  ...ENTREPRENEURSHIP_IDS.map((id, i) => ({
    id,
    title: `Entrepreneurship case ${i}`,
    title_bg: `Предприемачески казус ${i}`,
    description: 'desc',
    description_bg: 'опис',
    topic: 'Business Model',
    topic_bg: 'Бизнес модел',
    difficulty: i % 3 === 0 ? 'beginner' : i % 3 === 1 ? 'intermediate' : 'advanced',
    est_minutes: 45,
    published: true,
  })),
  {
    id: '99999999-0000-0000-0000-000000000001',
    title: 'Unrelated marketing case',
    title_bg: 'Несвързан маркетингов казус',
    description: 'x',
    description_bg: 'x',
    topic: 'Marketing',
    topic_bg: 'Маркетинг',
    difficulty: 'beginner',
    est_minutes: 30,
    published: true,
  },
  {
    id: '99999999-0000-0000-0000-000000000002',
    title: 'Another unrelated case',
    title_bg: 'Друг несвързан казус',
    description: 'x',
    description_bg: 'x',
    topic: 'Operations',
    topic_bg: 'Операции',
    difficulty: 'advanced',
    est_minutes: 90,
    published: true,
  },
];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: mockCases, error: null }),
        }),
      }),
    }),
  },
}));

import { useLang } from '@/context/LangContext';

function renderLib(initial: string, lang: 'en' | 'bg' = 'en') {
  (useLang as any).mockReturnValue({
    lang,
    t: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      min: 'min',
      loadingCases: 'Loading…',
    },
  });
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/cases" element={<CaseLibrary />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function waitForLoaded() {
  await screen.findByTestId('hdr');
  // Force microtask/tick to let supabase promise resolve
  await new Promise((r) => setTimeout(r, 0));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CaseLibrary — ?theme= filter', () => {
  it('with theme=entrepreneurship, restricts cases to entrepreneurship UUIDs (list view)', async () => {
    renderLib('/cases?theme=entrepreneurship');
    await waitForLoaded();
    // switch to list view for stable case-title assertions
    fireEvent.click(screen.getByTitle('List'));
    await new Promise((r) => setTimeout(r, 0));

    // Entrepreneurship cases are visible
    expect(screen.getByText('Entrepreneurship case 0')).toBeInTheDocument();
    // Noise cases are hidden
    expect(screen.queryByText('Unrelated marketing case')).not.toBeInTheDocument();
    expect(screen.queryByText('Another unrelated case')).not.toBeInTheDocument();
  });

  it('renders the theme filter chip and helper note in EN', async () => {
    renderLib('/cases?theme=entrepreneurship');
    await waitForLoaded();
    const chip = screen.getByTestId('case-theme-chip');
    expect(chip.textContent).toContain('Filtered by: Entrepreneurship');
    expect(within(chip).getByTestId('case-theme-chip-clear').textContent)
      .toContain('Show all cases');
    expect(screen.getByTestId('case-theme-entrepreneurship-note').textContent)
      .toMatch(/beginner cases train problem/i);
  });

  it('renders the theme filter chip and helper note in BG', async () => {
    renderLib('/cases?theme=entrepreneurship', 'bg');
    await waitForLoaded();
    const chip = screen.getByTestId('case-theme-chip');
    expect(chip.textContent).toContain('Филтър: Предприемачество');
    expect(within(chip).getByTestId('case-theme-chip-clear').textContent)
      .toContain('Покажи всички казуси');
    expect(screen.getByTestId('case-theme-entrepreneurship-note').textContent)
      .toMatch(/начинаещите казуси/i);
  });

  it('clear action removes the theme param and shows all cases again', async () => {
    renderLib('/cases?theme=entrepreneurship');
    await waitForLoaded();
    fireEvent.click(screen.getByTitle('List'));
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByText('Unrelated marketing case')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('case-theme-chip-clear'));
    await new Promise((r) => setTimeout(r, 0));

    expect(screen.queryByTestId('case-theme-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('case-theme-entrepreneurship-note')).not.toBeInTheDocument();
    expect(screen.getByText('Unrelated marketing case')).toBeInTheDocument();
  });

  it('invalid theme falls back to normal behavior (no chip, no note, all cases visible)', async () => {
    renderLib('/cases?theme=not-a-real-theme');
    await waitForLoaded();
    expect(screen.queryByTestId('case-theme-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('case-theme-entrepreneurship-note')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTitle('List'));
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.getByText('Unrelated marketing case')).toBeInTheDocument();
  });

  it('no theme param renders normal library without chip/note', async () => {
    renderLib('/cases');
    await waitForLoaded();
    expect(screen.queryByTestId('case-theme-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('case-theme-entrepreneurship-note')).not.toBeInTheDocument();
  });

  it('helper note only renders for theme=entrepreneurship, not other themes', async () => {
    renderLib('/cases?theme=marketing');
    await waitForLoaded();
    expect(screen.getByTestId('case-theme-chip').textContent)
      .toContain('Filtered by: Marketing');
    expect(screen.queryByTestId('case-theme-entrepreneurship-note')).not.toBeInTheDocument();
  });

  it('search filter still narrows results while theme filter is active', async () => {
    renderLib('/cases?theme=entrepreneurship');
    await waitForLoaded();
    fireEvent.click(screen.getByTitle('List'));
    await new Promise((r) => setTimeout(r, 0));
    fireEvent.change(screen.getByPlaceholderText(/Search cases/i), {
      target: { value: 'Entrepreneurship case 0' },
    });
    expect(screen.getByText('Entrepreneurship case 0')).toBeInTheDocument();
    expect(screen.queryByText('Entrepreneurship case 1')).not.toBeInTheDocument();
  });

  it('difficulty filter still applies on top of the theme filter', async () => {
    renderLib('/cases?theme=entrepreneurship');
    await waitForLoaded();
    fireEvent.click(screen.getByTitle('List'));
    await new Promise((r) => setTimeout(r, 0));

    // Apply "Beginner" difficulty (there are multiple "Beginner" buttons — take the pill in the filter bar)
    const beginnerButtons = screen.getAllByRole('button', { name: 'Beginner' });
    fireEvent.click(beginnerButtons[0]);
    await new Promise((r) => setTimeout(r, 0));

    // Only entrepreneurship cases at beginner difficulty (indices 0, 3, 6, ...) should be visible.
    expect(screen.getByText('Entrepreneurship case 0')).toBeInTheDocument();
    // Index 1 is intermediate → hidden
    expect(screen.queryByText('Entrepreneurship case 1')).not.toBeInTheDocument();
  });

  it('grid view under theme=entrepreneurship hides industry domains with no matching cases', async () => {
    renderLib('/cases?theme=entrepreneurship');
    await waitForLoaded();
    // Default view mode is grid. All entrepreneurship mock cases have topic
    // "Business Model" which falls back to the "AI & Data" domain, so only
    // that domain card should render.
    expect(screen.getByText('AI & Data')).toBeInTheDocument();
    expect(screen.queryByText('FinTech')).not.toBeInTheDocument();
    expect(screen.queryByText('EdTech')).not.toBeInTheDocument();
    expect(screen.queryByText('Smart Cities')).not.toBeInTheDocument();
    expect(screen.queryByText('Digital Health')).not.toBeInTheDocument();
  });

  it('grid view without a theme still renders the full industry grid', async () => {
    renderLib('/cases');
    await waitForLoaded();
    // Sanity: all industry domain cards render in the default browse view.
    expect(screen.getByText('AI & Data')).toBeInTheDocument();
    expect(screen.getByText('FinTech')).toBeInTheDocument();
    expect(screen.getByText('EdTech')).toBeInTheDocument();
    expect(screen.getByText('Smart Cities')).toBeInTheDocument();
    expect(screen.getByText('Digital Health')).toBeInTheDocument();
  });
});