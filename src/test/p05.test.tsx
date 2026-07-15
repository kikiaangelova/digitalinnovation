import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import { isNavActive, getBottomTabKeys } from '@/lib/nav';
import {
  isFeatureEnabled,
  enableFeatureFlag,
  disableFeatureFlag,
} from '@/lib/featureFlags';

// ─────────────────────────────────────────────────────────
// 1. Feature-flag behavior
// ─────────────────────────────────────────────────────────
describe('featureFlags', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it('defaults every flag to OFF', () => {
    expect(isFeatureEnabled('curriculum-v2026')).toBe(false);
    expect(isFeatureEnabled('teacher-workspace-v2')).toBe(false);
    expect(isFeatureEnabled('student-dashboard-v2')).toBe(false);
  });

  it('enableFeatureFlag turns a flag on and disableFeatureFlag turns it back off', () => {
    enableFeatureFlag('curriculum-v2026');
    expect(isFeatureEnabled('curriculum-v2026')).toBe(true);
    disableFeatureFlag('curriculum-v2026');
    expect(isFeatureEnabled('curriculum-v2026')).toBe(false);
  });

  it('enabling one flag does not enable siblings', () => {
    enableFeatureFlag('teacher-workspace-v2');
    expect(isFeatureEnabled('teacher-workspace-v2')).toBe(true);
    expect(isFeatureEnabled('curriculum-v2026')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// 2. Role-aware navigation configuration
// ─────────────────────────────────────────────────────────
describe('getBottomTabKeys', () => {
  it('students see Today · Learn · Cases · Startup · More', () => {
    expect(getBottomTabKeys('student')).toEqual([
      '/dashboard', '/learn', '/cases', '/my-startup', '__more__',
    ]);
  });

  it('teacher_pending never sees student-only Cases / Simulator / Startup tabs', () => {
    const tabs = getBottomTabKeys('teacher_pending');
    expect(tabs).not.toContain('/cases');
    expect(tabs).not.toContain('/simulator');
    expect(tabs).not.toContain('/my-startup');
    expect(tabs).toContain('/pending');
  });

  it('teacher_verified gets teacher-specific tabs, not student dashboard', () => {
    const tabs = getBottomTabKeys('teacher_verified');
    expect(tabs).toContain('/teacher-dashboard');
    expect(tabs).toContain('/teacher');
    expect(tabs).not.toContain('/dashboard');
    expect(tabs).not.toContain('/my-startup');
  });

  it('admin falls through to the student tab bar (admin links live in the More dropdown)', () => {
    expect(getBottomTabKeys('admin')).toEqual(getBottomTabKeys('student'));
  });
});

// ─────────────────────────────────────────────────────────
// 3. Nested-route active navigation matching
// ─────────────────────────────────────────────────────────
describe('isNavActive (nested route highlighting)', () => {
  it('exact match highlights the tab', () => {
    expect(isNavActive('/dashboard', '/dashboard')).toBe(true);
    expect(isNavActive('/cases', '/cases')).toBe(true);
  });

  it('/case/:id highlights the Cases tab', () => {
    expect(isNavActive('/cases', '/case/abc-123')).toBe(true);
    expect(isNavActive('/cases', '/case/abc-123/results')).toBe(true);
  });

  it('/learn/:slug highlights the Learn tab', () => {
    expect(isNavActive('/learn', '/learn/lean-startup')).toBe(true);
  });

  it('/simulator/... highlights the Simulator tab', () => {
    expect(isNavActive('/simulator', '/simulator/season/42/round/3')).toBe(true);
    expect(isNavActive('/simulator', '/simulator/preview')).toBe(true);
  });

  it('/my-startup and /journey nested paths highlight their parents', () => {
    // callers pass location.pathname (no query string), so a plain nested path highlights.
    expect(isNavActive('/my-startup', '/my-startup/edit')).toBe(true);
    expect(isNavActive('/journey', '/journey/learn/stage-3')).toBe(true);
  });

  it('does not cross-highlight unrelated routes', () => {
    expect(isNavActive('/cases', '/dashboard')).toBe(false);
    expect(isNavActive('/learn', '/cases')).toBe(false);
    expect(isNavActive('/teacher', '/teacher-dashboard')).toBe(false);
    expect(isNavActive('/teacher', '/teacher-new')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// 4. Protected-route redirect (RoleGuard)
// ─────────────────────────────────────────────────────────

// Mock the auth context to drive RoleGuard branches in isolation.
type MockAuth = {
  user: any;
  userRole: string | null;
  authLoading: boolean;
  roleLoading: boolean;
};
let mockAuth: MockAuth = {
  user: null,
  userRole: null,
  authLoading: false,
  roleLoading: false,
};
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockAuth,
  __esModule: true,
}));

// Import AFTER the mock so RoleGuard picks it up.
import RoleGuard from '@/components/layout/RoleGuard';

function renderWithRoutes(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/auth" element={<div>AUTH_PAGE</div>} />
        <Route path="/dashboard" element={<div>STUDENT_DASHBOARD</div>} />
        <Route path="/pending" element={<div>PENDING_PAGE</div>} />
        <Route
          path="/teacher"
          element={
            <RoleGuard allowed={['teacher_verified', 'admin']} redirectTo="/dashboard">
              <div>TEACHER_PAGE</div>
            </RoleGuard>
          }
        />
        <Route
          path="/cases"
          element={
            <RoleGuard allowed={['student', 'teacher_verified', 'admin']}>
              <div>CASES_PAGE</div>
            </RoleGuard>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('RoleGuard (protected routes)', () => {
  it('unauthenticated user is redirected to /auth', () => {
    mockAuth = { user: null, userRole: null, authLoading: false, roleLoading: false };
    renderWithRoutes('/cases');
    expect(screen.getByText('AUTH_PAGE')).toBeInTheDocument();
  });

  it('teacher_pending is redirected to /pending, not to a random student page', () => {
    mockAuth = { user: { id: 'u1' }, userRole: 'teacher_pending', authLoading: false, roleLoading: false };
    renderWithRoutes('/cases');
    expect(screen.getByText('PENDING_PAGE')).toBeInTheDocument();
  });

  it('student cannot reach a teacher-only route and is sent to redirectTo', () => {
    mockAuth = { user: { id: 'u1' }, userRole: 'student', authLoading: false, roleLoading: false };
    renderWithRoutes('/teacher');
    expect(screen.getByText('STUDENT_DASHBOARD')).toBeInTheDocument();
  });

  it('allowed role renders the protected page', () => {
    mockAuth = { user: { id: 'u1' }, userRole: 'student', authLoading: false, roleLoading: false };
    renderWithRoutes('/cases');
    expect(screen.getByText('CASES_PAGE')).toBeInTheDocument();
  });

  it('while auth is loading, the guard renders nothing (no premature redirect)', () => {
    mockAuth = { user: null, userRole: null, authLoading: true, roleLoading: true };
    const { container } = renderWithRoutes('/cases');
    expect(container.textContent).toBe('');
  });
});
