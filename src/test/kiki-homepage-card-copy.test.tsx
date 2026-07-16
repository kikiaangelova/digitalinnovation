import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import { LangProvider } from '@/context/LangContext';
import { AuthContext } from '@/context/AuthContext';

const renderHome = (lang: 'en' | 'bg' = 'en', user = null) => {
  window.localStorage.setItem('digilab-lang', lang);
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, isLoading: false, session: null, refreshSession: vi.fn(), signOut: vi.fn() } as any}>
        <LangProvider>
          <Index />
        </LangProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Kiki homepage card copy', () => {
  it('does not imply Kiki AI has 20 years of experience (BG)', () => {
    renderHome('bg');
    const main = screen.getByRole('main');
    expect(main).not.toHaveTextContent(/20 години/);
    expect(main).not.toHaveTextContent(/20 years/);
  });

  it('does not claim Kiki AI is the real human Kirilka (BG)', () => {
    renderHome('bg');
    const main = screen.getByRole('main');
    expect(main).not.toHaveTextContent(/Кирилка Ангелова/);
    expect(main).not.toHaveTextContent(/Kirilka Angelova/);
  });

  it('does not claim Kiki AI is the real human Kirilka (EN)', () => {
    renderHome('en');
    const main = screen.getByRole('main');
    expect(main).not.toHaveTextContent(/Kirilka Angelova/);
  });

  it('shows BG title and CTA', () => {
    renderHome('bg');
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('Аз съм Kiki AI.');
    expect(main).toHaveTextContent('Твоят ментор в платформата.');
    const button = within(main).getByRole('button', { name: /Попитай Kiki/i });
    expect(button).toBeInTheDocument();
  });

  it('shows EN title and CTA', () => {
    renderHome('en');
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent("I'm Kiki AI.");
    expect(main).toHaveTextContent('Your mentor inside the platform.');
    const button = within(main).getByRole('button', { name: /Ask Kiki/i });
    expect(button).toBeInTheDocument();
  });

  it('does not use "ask anything" wording', () => {
    renderHome('en');
    const main = screen.getByRole('main');
    expect(main).not.toHaveTextContent(/ask anything/i);
    expect(main).not.toHaveTextContent(/питай каквото искаш/i);
  });

  it('does not use childish "Здрасти" as the main Kiki card CTA', () => {
    renderHome('bg');
    const main = screen.getByRole('main');
    expect(main).not.toHaveTextContent('Здрасти');
    expect(main).toHaveTextContent('Попитай Kiki');
  });
});
