import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/features/admin/lib/guard', () => ({
  requireAdmin: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/features/admin/lib/guard';
import {
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
  publishNewsPost,
} from '../actions';

const mockedCreateClient = vi.mocked(createClient);
const mockedRequireAdmin = vi.mocked(requireAdmin);

const GUARD_OK   = null;
const GUARD_FAIL = { status: 'error' as const, code: 'UNAUTHORIZED' as const };

function makeChain(result: { data: unknown; error: unknown }) {
  const promise = Promise.resolve(result);
  const chain: any = Object.assign(promise, {
    select:      vi.fn(),
    eq:          vi.fn(),
    order:       vi.fn(),
    maybeSingle: vi.fn(),
    single:      vi.fn(),
    insert:      vi.fn(),
    update:      vi.fn(),
    delete:      vi.fn(),
  });
  for (const key of Object.keys(chain)) {
    chain[key].mockReturnValue(chain);
  }
  return chain;
}

function makeClient(chain: ReturnType<typeof makeChain>) {
  return { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<ReturnType<typeof createClient>>;
}

const VALID_INPUT = {
  slug: 'primer-post',
  title_es: 'Primer post',
  title_en: 'First post',
};

// ─── createNewsPost ───────────────────────────────────────────────────────────

describe('createNewsPost', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await createNewsPost(VALID_INPUT);

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('returns VALIDATION error when input is invalid', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);

    const result = await createNewsPost({ slug: '', title_es: '', title_en: '' });

    expect(result).toMatchObject({ status: 'error', code: 'VALIDATION' });
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('inserts post and returns success when valid and admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const created = { id: 'new-id', ...VALID_INPUT };
    const chain = makeChain({ data: created, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await createNewsPost(VALID_INPUT);

    expect(result).toMatchObject({ status: 'success', data: created });
    expect(chain.insert).toHaveBeenCalled();
  });

  it('returns DB_ERROR when insert fails', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: { message: 'unique violation' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await createNewsPost(VALID_INPUT);

    expect(result).toMatchObject({ status: 'error', code: 'DB_ERROR' });
  });
});

// ─── updateNewsPost ───────────────────────────────────────────────────────────

describe('updateNewsPost', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await updateNewsPost('some-id', { title_es: 'Nuevo' });

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('returns VALIDATION error when input is invalid', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);

    const result = await updateNewsPost('some-id', { slug: 'TIENE ESPACIOS' });

    expect(result).toMatchObject({ status: 'error', code: 'VALIDATION' });
  });

  it('updates post and returns success when valid and admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const updated = { id: 'some-id', title_es: 'Actualizado' };
    const chain = makeChain({ data: updated, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await updateNewsPost('some-id', { title_es: 'Actualizado' });

    expect(result).toMatchObject({ status: 'success', data: updated });
    expect(chain.update).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', 'some-id');
  });
});

// ─── deleteNewsPost ───────────────────────────────────────────────────────────

describe('deleteNewsPost', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await deleteNewsPost('some-id');

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('deletes post and returns success when admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await deleteNewsPost('some-id');

    expect(result).toMatchObject({ status: 'success' });
    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', 'some-id');
  });
});

// ─── publishNewsPost ──────────────────────────────────────────────────────────

describe('publishNewsPost', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await publishNewsPost('some-id', true, null);

    expect(result).toEqual(GUARD_FAIL);
  });

  it('sets is_published=true and published_at=now() when currentPublishedAt is null', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const before = new Date().toISOString();
    const result = await publishNewsPost('some-id', true, null);
    const after = new Date().toISOString();

    expect(result).toMatchObject({ status: 'success' });
    const updateCall = chain.update.mock.calls[0][0];
    expect(updateCall.is_published).toBe(true);
    expect(updateCall.published_at).toBeDefined();
    expect(updateCall.published_at >= before).toBe(true);
    expect(updateCall.published_at <= after).toBe(true);
    expect(chain.eq).toHaveBeenCalledWith('id', 'some-id');
  });

  it('preserves existing published_at when re-publishing', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));
    const existingDate = '2026-01-01T00:00:00.000Z';

    await publishNewsPost('some-id', true, existingDate);

    expect(chain.update).toHaveBeenCalledWith({
      is_published: true,
      published_at: existingDate,
    });
  });

  it('sets only is_published=false when unpublishing, does not touch published_at', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await publishNewsPost('some-id', false, '2026-01-01T00:00:00.000Z');

    expect(chain.update).toHaveBeenCalledWith({ is_published: false });
  });
});
