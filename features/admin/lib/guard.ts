import type { CurrentUserState } from '@/features/auth/lib/server';
import { getCurrentUserState } from '@/features/auth/lib/server';

export type AdminGuardError = { status: 'error'; code: 'UNAUTHORIZED' };

export function isAdmin(state: CurrentUserState): boolean {
  return state.profile?.role === 'admin';
}

export function isStaff(state: CurrentUserState): boolean {
  return state.profile?.role === 'moderator' || state.profile?.role === 'admin';
}

export async function requireStaff(): Promise<AdminGuardError | null> {
  const state = await getCurrentUserState();
  if (!isStaff(state)) {
    return { status: 'error', code: 'UNAUTHORIZED' };
  }
  return null;
}

export async function requireAdmin(): Promise<AdminGuardError | null> {
  const state = await getCurrentUserState();
  if (!isAdmin(state)) {
    return { status: 'error', code: 'UNAUTHORIZED' };
  }
  return null;
}
