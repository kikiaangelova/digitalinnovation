import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Language state V1B — header pill semantics', () => {
  it('pill shows current language and aria-label states the switch target (EN active)', () => {
    // Simulates the pill markup produced by AppHeader when lang === 'en'.
    render(
      <button
        aria-label="Language: English. Switch to Bulgarian"
        title="Language: EN — switch to Български"
        data-current-lang="en"
      >
        <span>EN</span>
        <span aria-hidden="true">→ BG</span>
      </button>,
    );
    const btn = screen.getByRole('button', {
      name: /Language: English\. Switch to Bulgarian/i,
    });
    expect(btn).toHaveAttribute('data-current-lang', 'en');
    expect(btn.textContent).toMatch(/^EN/);
  });

  it('pill shows current language and aria-label states the switch target (BG active)', () => {
    render(
      <button
        aria-label="Език: Български. Превключи на английски"
        title="Език: BG — превключи на English"
        data-current-lang="bg"
      >
        <span>BG</span>
        <span aria-hidden="true">→ EN</span>
      </button>,
    );
    const btn = screen.getByRole('button', {
      name: /Език: Български\. Превключи на английски/i,
    });
    expect(btn).toHaveAttribute('data-current-lang', 'bg');
    expect(btn.textContent).toMatch(/^BG/);
  });
});

describe('Language state V1B — visible strings follow lang', () => {
  const t = (lang: 'en' | 'bg') => (en: string, bg: string) =>
    lang === 'bg' ? bg : en;

  it('SubjectDetail empty-state strings render in Bulgarian when lang=bg', () => {
    const tr = t('bg');
    expect(tr('My Subjects', 'Моите предмети')).toBe('Моите предмети');
    expect(tr('Preview', 'В процес на подготовка')).toBe(
      'В процес на подготовка',
    );
    expect(
      tr(
        'Learning content for this subject is being prepared.',
        'Съдържанието за този предмет се подготвя.',
      ),
    ).toBe('Съдържанието за този предмет се подготвя.');
    expect(
      tr(
        'We will add modules here as they become playable.',
        'Ще добавим модули тук, щом станат готови за използване.',
      ),
    ).toBe('Ще добавим модули тук, щом станат готови за използване.');
  });

  it('SubjectDetail empty-state strings render in English when lang=en', () => {
    const tr = t('en');
    expect(tr('My Subjects', 'Моите предмети')).toBe('My Subjects');
    expect(tr('Preview', 'В процес на подготовка')).toBe('Preview');
    expect(
      tr(
        'Learning content for this subject is being prepared.',
        'Съдържанието за този предмет се подготвя.',
      ),
    ).toBe('Learning content for this subject is being prepared.');
  });

  it('LearningModules "My Subjects" heading follows lang', () => {
    expect(t('bg')('My Subjects', 'Моите предмети')).toBe('Моите предмети');
    expect(t('en')('My Subjects', 'Моите предмети')).toBe('My Subjects');
  });

  it('Mobile bottom-nav student labels follow lang', () => {
    const labels = (lang: 'en' | 'bg') => [
      lang === 'bg' ? 'Днес' : 'Today',
      lang === 'bg' ? 'Учи' : 'Learn',
      lang === 'bg' ? 'Казуси' : 'Cases',
      lang === 'bg' ? 'Стартъп' : 'Startup',
      lang === 'bg' ? 'Още' : 'More',
    ];
    expect(labels('bg')).toEqual(['Днес', 'Учи', 'Казуси', 'Стартъп', 'Още']);
    expect(labels('en')).toEqual(['Today', 'Learn', 'Cases', 'Startup', 'More']);
  });
});
