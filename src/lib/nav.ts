/**
 * Pure navigation helpers — no React, no browser APIs.
 * Kept pure so route/nav behavior is unit-testable.
 */

export type NavRole = 'student' | 'teacher_pending' | 'teacher_verified' | 'admin';

/**
 * Returns true when a nav item pointing at `navPath` should be highlighted
 * for the current URL `currentPath`, including nested-route parent matches.
 */
export function isNavActive(navPath: string, currentPath: string): boolean {
  if (!navPath || !currentPath) return false;
  if (navPath === currentPath) return true;
  const p = currentPath;
  if (navPath === '/cases' && p.startsWith('/case/')) return true;
  if (navPath === '/learn' && p.startsWith('/learn/')) return true;
  if (navPath === '/simulator' && p.startsWith('/simulator')) return true;
  if (navPath === '/journey' && p.startsWith('/journey')) return true;
  if (navPath === '/my-startup' && p.startsWith('/my-startup')) return true;
  if (
    navPath === '/teacher' &&
    p.startsWith('/teacher') &&
    p !== '/teacher-dashboard' &&
    p !== '/teacher-new'
  ) {
    return true;
  }
  return false;
}

export interface BottomTab {
  to: string;
  key: string;
}

/**
 * Returns the ordered list of bottom-tab keys shown to a signed-in user for
 * their role. Kept string-only so it can be asserted in tests without pulling
 * in i18n or icons.
 */
export function getBottomTabKeys(role: NavRole): string[] {
  if (role === 'teacher_pending') {
    return ['/pending', '/profile', '/dictionary', '/about', '__more__'];
  }
  if (role === 'teacher_verified') {
    return ['/teacher-dashboard', '/teacher', '/cases', '/learn', '__more__'];
  }
  // student and admin get the student tab bar (admin sees admin links inside "More")
  return ['/dashboard', '/learn', '/cases', '/my-startup', '__more__'];
}
