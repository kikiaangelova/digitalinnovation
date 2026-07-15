/**
 * Lightweight client-side feature flags for staged rollouts.
 *
 * A flag is ON when ANY of these is true:
 *   1. `localStorage.setItem('ff:<key>', '1')` has been set in this browser
 *   2. The URL contains `?ff-<key>=1` (persists to localStorage on read)
 *   3. The Vite env var `VITE_FF_<KEY_UPPERCASE>` is `'1'` at build time
 *
 * Flags default OFF. Nothing in the DB, no user-facing UI — this is a dev/QA
 * gating primitive only. Never use it as a security boundary; RLS and
 * RoleGuard remain the real controls.
 */

export type FeatureFlagKey =
  | 'teacher-workspace-v2'
  | 'student-dashboard-v2'
  | 'curriculum-v2026';

const STORAGE_PREFIX = 'ff:';

function readEnvFlag(key: FeatureFlagKey): boolean {
  const envKey = `VITE_FF_${key.replace(/-/g, '_').toUpperCase()}`;
  // Vite exposes import.meta.env as a plain object at build time.
  const raw = (import.meta as any).env?.[envKey];
  return raw === '1' || raw === 'true';
}

function readUrlFlag(key: FeatureFlagKey): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const val = params.get(`ff-${key}`);
    if (val === '1' || val === 'true') {
      window.localStorage.setItem(STORAGE_PREFIX + key, '1');
      return true;
    }
    if (val === '0' || val === 'false') {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
      return false;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function readStorageFlag(key: FeatureFlagKey): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + key) === '1';
  } catch {
    return false;
  }
}

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  return readEnvFlag(key) || readUrlFlag(key) || readStorageFlag(key);
}

export function enableFeatureFlag(key: FeatureFlagKey): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, '1');
  } catch {
    /* ignore */
  }
}

export function disableFeatureFlag(key: FeatureFlagKey): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}