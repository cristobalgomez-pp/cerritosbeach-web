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
  createSurfShop,
  updateSurfShop,
  deleteSurfShop,
  togglePublish,
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
  slug: 'cerritos-surf',
  name_es: 'Cerritos Surf',
  name_en: 'Cerritos Surf',
};

// ─── createSurfShop ───────────────────────────────────────────────────────────

describe('createSurfShop', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await createSurfShop(VALID_INPUT);

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('returns VALIDATION error when required fields are missing', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);

    const result = await createSurfShop({ slug: '', name_es: '', name_en: '' });

    expect(result).toMatchObject({ status: 'error', code: 'VALIDATION' });
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('returns VALIDATION error when slug has invalid characters', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);

    const result = await createSurfShop({ slug: 'Has Spaces', name_es: 'x', name_en: 'x' });

    expect(result).toMatchObject({ status: 'error', code: 'VALIDATION' });
  });

  it('inserts surf shop and returns success when valid and admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const created = { id: 'new-id', ...VALID_INPUT };
    const chain = makeChain({ data: created, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await createSurfShop(VALID_INPUT);

    expect(result).toMatchObject({ status: 'success', data: created });
    expect(chain.insert).toHaveBeenCalled();
  });

  it('persists the services array correctly', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const created = { id: 'new-id', slug: 'cerritos-surf', name_es: 'x', name_en: 'x', services: ['rentals', 'lessons'] };
    const chain = makeChain({ data: created, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await createSurfShop({ slug: 'cerritos-surf', name_es: 'x', name_en: 'x', services: ['rentals', 'lessons'] });

    expect(result).toMatchObject({ status: 'success' });
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ services: ['rentals', 'lessons'] }));
  });

  it('returns DB_ERROR when insert fails', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: { message: 'unique violation' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await createSurfShop(VALID_INPUT);

    expect(result).toMatchObject({ status: 'error', code: 'DB_ERROR' });
  });
});

// ─── updateSurfShop ───────────────────────────────────────────────────────────

describe('updateSurfShop', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await updateSurfShop('some-id', { name_es: 'Nuevo' });

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('returns VALIDATION error when slug has invalid characters', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);

    const result = await updateSurfShop('some-id', { slug: 'HAS SPACES' });

    expect(result).toMatchObject({ status: 'error', code: 'VALIDATION' });
  });

  it('updates surf shop and returns success when valid and admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const updated = { id: 'some-id', name_es: 'Actualizado' };
    const chain = makeChain({ data: updated, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await updateSurfShop('some-id', { name_es: 'Actualizado' });

    expect(result).toMatchObject({ status: 'success', data: updated });
    expect(chain.update).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', 'some-id');
  });
});

// ─── deleteSurfShop ───────────────────────────────────────────────────────────

describe('deleteSurfShop', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await deleteSurfShop('some-id');

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it('deletes surf shop and returns success when admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await deleteSurfShop('some-id');

    expect(result).toMatchObject({ status: 'success' });
    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', 'some-id');
  });
});

// ─── togglePublish ────────────────────────────────────────────────────────────

describe('togglePublish', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns UNAUTHORIZED when not admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await togglePublish('some-id', true);

    expect(result).toEqual(GUARD_FAIL);
  });

  it('updates only is_published and returns success when admin', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await togglePublish('some-id', true);

    expect(result).toMatchObject({ status: 'success' });
    expect(chain.update).toHaveBeenCalledWith({ is_published: true });
    expect(chain.eq).toHaveBeenCalledWith('id', 'some-id');
  });

  it('can unpublish a surf shop', async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await togglePublish('some-id', false);

    expect(chain.update).toHaveBeenCalledWith({ is_published: false });
  });
});
