import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import KikiBioCard from '@/components/mentor/KikiBioCard';
import { KIKI } from '@/lib/kiki-persona';

describe('KikiBioCard tagline (V1B)', () => {
  const forbidden = ['coach', 'teacher', 'trainer', 'коуч', 'учител', 'треньор'];

  it('EN tagline contains no human-role words and describes AI mentor', () => {
    const { container } = render(<KikiBioCard lang="en" />);
    const text = container.textContent ?? '';
    for (const w of forbidden) {
      expect(text.toLowerCase()).not.toContain(w.toLowerCase());
    }
    expect(text).toMatch(/AI mentor inside the platform/i);
  });

  it('BG tagline contains no human-role words and describes AI ментор', () => {
    const { container } = render(<KikiBioCard lang="bg" />);
    const text = container.textContent ?? '';
    for (const w of forbidden) {
      expect(text.toLowerCase()).not.toContain(w.toLowerCase());
    }
    expect(text).toMatch(/AI ментор в платформата/);
  });

  it('KIKI constants use the new AI-mentor tagline', () => {
    expect(KIKI.taglineEn).toMatch(/^AI mentor inside the platform/);
    expect(KIKI.taglineBg).toMatch(/^AI ментор в платформата/);
  });
});

describe('Dashboard Ask Kiki microcopy + anchor (V1B)', () => {
  const src = readFileSync(
    path.resolve(__dirname, '../pages/StudentDashboard.tsx'),
    'utf8',
  );

  it('uses the broader "Jump to Kiki\u2019s mentor review" copy (EN + BG)', () => {
    expect(src).toMatch(/Jump to Kiki(\\u2019|\u2019|')s mentor review below\./);
    expect(src).toContain('Отиди до менторския преглед от Kiki по-долу.');
  });

  it('does not use the old project-only copy', () => {
    expect(src).not.toMatch(/Get Kiki(\\u2019|\u2019|')s review of your project below\./);
    expect(src).not.toContain('Виж прегледа на Kiki за проекта ти по-долу.');
  });

  it('#kiki-mentor anchor and Ask Kiki chip still exist', () => {
    expect(src).toContain('id="kiki-mentor"');
    expect(src).toContain('href="#kiki-mentor"');
    expect(src).toMatch(/Ask Kiki/);
    expect(src).toMatch(/Попитай Kiki/);
  });

  it('mobile bottom spacing added around the Kiki mentor section to clear the floating CTA', () => {
    // Section around #kiki-mentor should have mb-32 (mobile) to avoid FAB overlap.
    expect(src).toMatch(/id="kiki-mentor"[\s\S]{0,400}mb-32/);
  });
});
