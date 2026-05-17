import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CurrentUserState } from '@/features/auth/lib/server';

vi.mock('@/features/auth/lib/server', () => ({
  getCurrentUserState: vi.fn(),
}));

import { isAdmin, requireAdmin, isStaff, requireStaff } from '../guard';
import { getCurrentUserState } from '@/features/auth/lib/server';

const mockedGetCurrentUserState = vi.mocked(getCurrentUserState);

function unauthenticated(): CurrentUserState {
  return { user: null, profile: null };
}

function withRole(role: 'member' | 'moderator' | 'admin'): CurrentUserState {
  return {
    user: { id: 'user-1', email: 'test@test.com' },
    profile: {
      username: 'testuser',
      display_name: 'Test User',
      member_type: 'local',
      locale: 'es',
      role,
      is_approved: true,
    },
  };
}

// ─── isAdmin (pure function) ───────────────────────────────────────────────

describe('isAdmin', () => {
  it('returns false when unauthenticated (user: null, profile: null)', () => {
    expect(isAdmin(unauthenticated())).toBe(false);
  });

  it('returns false when authenticated but profile is null', () => {
    expect(isAdmin({ user: { id: 'u1', email: 'x@x.com' }, profile: null })).toBe(false);
  });

  it('returns false when role is member', () => {
    expect(isAdmin(withRole('member'))).toBe(false);
  });

  it('returns false when role is moderator', () => {
    expect(isAdmin(withRole('moderator'))).toBe(false);
  });

  it('returns true when role is admin', () => {
    expect(isAdmin(withRole('admin'))).toBe(true);
  });
});

// ─── requireAdmin (async, calls getCurrentUserState) ──────────────────────

describe('requireAdmin', () => {
  beforeEach(() => {
    mockedGetCurrentUserState.mockReset();
  });

  it('returns UNAUTHORIZED when unauthenticated', async () => {
    mockedGetCurrentUserState.mockResolvedValue(unauthenticated());
    expect(await requireAdmin()).toEqual({ status: 'error', code: 'UNAUTHORIZED' });
  });

  it('returns UNAUTHORIZED when role is member', async () => {
    mockedGetCurrentUserState.mockResolvedValue(withRole('member'));
    expect(await requireAdmin()).toEqual({ status: 'error', code: 'UNAUTHORIZED' });
  });

  it('returns UNAUTHORIZED when role is moderator', async () => {
    mockedGetCurrentUserState.mockResolvedValue(withRole('moderator'));
    expect(await requireAdmin()).toEqual({ status: 'error', code: 'UNAUTHORIZED' });
  });

  it('does not call the mutation when unauthorized', async () => {
    mockedGetCurrentUserState.mockResolvedValue(unauthenticated());
    const mutation = vi.fn();
    const action = async () => {
      const guard = await requireAdmin();
      if (guard) return guard;
      mutation();
      return { status: 'success' as const };
    };
    await action();
    expect(mutation).not.toHaveBeenCalled();
  });

  it('returns null when role is admin (action is allowed to proceed)', async () => {
    mockedGetCurrentUserState.mockResolvedValue(withRole('admin'));
    expect(await requireAdmin()).toBeNull();
  });
});

// ─── isStaff (pure function) ───────────────────────────────────────────────

describe('isStaff', () => {
  it('returns false when unauthenticated (profile: null)', () => {
    expect(isStaff(unauthenticated())).toBe(false);
  });

  it('returns false when role is member', () => {
    expect(isStaff(withRole('member'))).toBe(false);
  });

  it('returns true when role is moderator', () => {
    expect(isStaff(withRole('moderator'))).toBe(true);
  });

  it('returns true when role is admin', () => {
    expect(isStaff(withRole('admin'))).toBe(true);
  });
});

// ─── requireStaff (async) ─────────────────────────────────────────────────

describe('requireStaff', () => {
  beforeEach(() => {
    mockedGetCurrentUserState.mockReset();
  });

  it('returns UNAUTHORIZED when unauthenticated', async () => {
    mockedGetCurrentUserState.mockResolvedValue(unauthenticated());
    expect(await requireStaff()).toEqual({ status: 'error', code: 'UNAUTHORIZED' });
  });

  it('returns UNAUTHORIZED when role is member', async () => {
    mockedGetCurrentUserState.mockResolvedValue(withRole('member'));
    expect(await requireStaff()).toEqual({ status: 'error', code: 'UNAUTHORIZED' });
  });

  it('returns null when role is moderator (action is allowed to proceed)', async () => {
    mockedGetCurrentUserState.mockResolvedValue(withRole('moderator'));
    expect(await requireStaff()).toBeNull();
  });

  it('returns null when role is admin (action is allowed to proceed)', async () => {
    mockedGetCurrentUserState.mockResolvedValue(withRole('admin'));
    expect(await requireStaff()).toBeNull();
  });
});
