import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/features/admin/lib/guard', () => ({
  requireStaff: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { requireStaff } from '@/features/admin/lib/guard';
import { banUser } from '../actions';

const mockedCreateClient = vi.mocked(createClient);
const mockedRequireStaff = vi.mocked(requireStaff);

const GUARD_OK   = null;
const GUARD_FAIL = { status: 'error' as const, code: 'UNAUTHORIZED' as const };

function makeChain(result: { data: unknown; error: unknown }) {
  const promise = Promise.resolve(result);
  const chain: any = Object.assign(promise, {
    select: vi.fn(),
    eq:     vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
    single: vi.fn(),
  });
  for (const key of Object.keys(chain)) {
    if (typeof chain[key] === 'function') chain[key].mockReturnValue(chain);
  }
  return chain;
}

function makeClient(chain: ReturnType<typeof makeChain>) {
  return { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<ReturnType<typeof createClient>>;
}

// ─── banUser ──────────────────────────────────────────────────────────────

describe('banUser', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when caller is not staff', async () => {
    mockedRequireStaff.mockResolvedValue(GUARD_FAIL);

    const result = await banUser('user-123');

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('sets is_banned, banned_reason and banned_at on the target profile', async () => {
    mockedRequireStaff.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await banUser('user-123', 'spam');

    expect(result).toMatchObject({ status: 'success' });
    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ is_banned: true, banned_reason: 'spam' })
    );
    expect(chain.eq).toHaveBeenCalledWith('id', 'user-123');
  });

  it('inserts a ban_user record in audit_log', async () => {
    mockedRequireStaff.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    const client = makeClient(chain);
    mockedCreateClient.mockResolvedValue(client);

    await banUser('user-123', 'harassment');

    expect(client.from).toHaveBeenCalledWith('audit_log');
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'ban_user',
        target_type: 'profile',
        target_id: 'user-123',
      })
    );
  });

  it('returns DB_ERROR when profile update fails', async () => {
    mockedRequireStaff.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: { message: 'connection error' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await banUser('user-123');

    expect(result).toMatchObject({ status: 'error', code: 'DB_ERROR' });
  });
});
