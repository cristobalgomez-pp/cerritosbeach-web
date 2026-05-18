import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/features/admin/lib/guard', () => ({ requireAdmin: vi.fn() }));

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/features/admin/lib/guard';
import { upsertPageSeo } from '../actions';

const mockedCreateClient = vi.mocked(createClient);
const mockedRequireAdmin = vi.mocked(requireAdmin);

const GUARD_OK   = null;
const GUARD_FAIL = { status: 'error' as const, code: 'UNAUTHORIZED' as const };

function makeChain(result: { data: unknown; error: unknown }) {
  const promise = Promise.resolve(result);
  const chain: any = Object.assign(promise, {
    upsert: vi.fn(), select: vi.fn(), eq: vi.fn(),
  });
  for (const key of Object.keys(chain)) chain[key].mockReturnValue(chain);
  return chain;
}

function makeClient(chain: ReturnType<typeof makeChain>) {
  return { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<ReturnType<typeof createClient>>;
}

const VALID_DATA = { title_es: 'Cerritos', title_en: 'Cerritos' };

describe('upsertPageSeo', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await upsertPageSeo('home', VALID_DATA);

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('returns VALIDATION error when title exceeds max length', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);

    const result = await upsertPageSeo('home', { title_es: 'x'.repeat(71) });

    expect(result).toMatchObject({ status: 'error', code: 'VALIDATION' });
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('upserts record and returns success when valid and admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await upsertPageSeo('home', VALID_DATA);

    expect(result).toMatchObject({ status: 'success' });
    expect(chain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ page: 'home', title_es: 'Cerritos' }),
      expect.objectContaining({ onConflict: 'page' }),
    );
  });

  it('returns DB_ERROR when the database fails', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: { message: 'unique violation' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await upsertPageSeo('home', VALID_DATA);

    expect(result).toMatchObject({ status: 'error', code: 'DB_ERROR' });
  });
});
