import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutDigitalInnovation from '@/pages/AboutDigitalInnovation';
import { LangProvider } from '@/context/LangContext';
import { AuthContext } from '@/context/AuthContext';

const renderAbout = (lang: 'en' | 'bg' = 'en', user: any = null) => {
  localStorage.setItem('digiinnov-lang', lang);
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, isLoading: false, session: null, refreshSession: vi.fn(), signOut: vi.fn() } as any}>
        <LangProvider>
          <AboutDigitalInnovation />
        </LangProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('About page cleanup V1', () => {
  beforeEach(() => localStorage.clear());

  it('does not render legacy academic topic titles', () => {
    renderAbout('en');
    const main = screen.getByRole('main');
    expect(main).not.toHaveTextContent(/What is Digital Innovation\?/);
    expect(main).not.toHaveTextContent(/AI and the Data Economy/);
    expect(main).not.toHaveTextContent(/Platform Economy & Network Effects/);
    expect(main).not.toHaveTextContent(/Startup Ecosystems/);
  });

  it('renders EN hero title and creator name and CTAs', () => {
    renderAbout('en');
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('About DigiInnov');
    expect(main).toHaveTextContent('Kirilka Angelova');
    expect(main).toHaveTextContent(/educator and mentor working in digital innovation/i);
    expect(within(main).getByRole('button', { name: /Enter the platform/i })).toBeInTheDocument();
    expect(within(main).getByRole('button', { name: /Explore cases/i })).toBeInTheDocument();
  });

  it('renders BG hero title and creator name and CTAs', () => {
    renderAbout('bg');
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('За DigiInnov');
    expect(main).toHaveTextContent('Кирилка Ангелова');
    expect(main).toHaveTextContent(/преподавател и ментор/i);
    expect(within(main).getByRole('button', { name: /Влез в платформата/i })).toBeInTheDocument();
    expect(within(main).getByRole('button', { name: /Разгледай казусите/i })).toBeInTheDocument();
  });
});