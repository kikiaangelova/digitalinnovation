/**
 * Client-only read-state for practice-first modules.
 *
 * Backed by localStorage. Not a completion signal, not an XP source,
 * not synced to the backend, not visible to teachers. Users may toggle
 * freely.
 *
 * Key shape: `pf:read:<userId | "anonymous">:<moduleId>`
 */

const PREFIX = 'pf:read';

export function pfReadKey(userId: string | null | undefined, moduleId: string): string {
  const uid = userId && userId.length > 0 ? userId : 'anonymous';
  return `${PREFIX}:${uid}:${moduleId}`;
}

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isModuleRead(
  userId: string | null | undefined,
  moduleId: string,
): boolean {
  const s = safeStorage();
  if (!s) return false;
  try {
    return s.getItem(pfReadKey(userId, moduleId)) === '1';
  } catch {
    return false;
  }
}

export function setModuleRead(
  userId: string | null | undefined,
  moduleId: string,
  read: boolean,
): void {
  const s = safeStorage();
  if (!s) return;
  try {
    const key = pfReadKey(userId, moduleId);
    if (read) s.setItem(key, '1');
    else s.removeItem(key);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function countReadModules(
  userId: string | null | undefined,
  moduleIds: string[],
): number {
  return moduleIds.reduce(
    (acc, id) => acc + (isModuleRead(userId, id) ? 1 : 0),
    0,
  );
}