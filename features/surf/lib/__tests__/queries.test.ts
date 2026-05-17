import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { getSurfShops, getAdminSurfShops, getAdminSurfShop } from '../queries';

const mockedCreateClient = vi.mocked(createClient);

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

// ─── getSurfShops ─────────────────────────────────────────────────────────────

describe('getSurfShops', () => {
  beforeEach(() => vi.resetAllMocks());

  it('queries only published surf shops ordered by featured desc', async () => {
    const shops = [
      { id: '1', name_es: 'Cerritos Surf', featured: true,  is_published: true },
      { id: '2', name_es: 'Mario Surf',    featured: false, is_published: true },
    ];
    const chain = makeChain({ data: shops, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getSurfShops();

    expect(result).toEqual(shops);
    expect(chain.eq).toHaveBeenCalledWith('is_published', true);
    expect(chain.order).toHaveBeenCalledWith('featured', { ascending: false });
  });

  it('returns empty array when data is null', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getSurfShops()).toEqual([]);
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB exploded' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getSurfShops()).rejects.toMatchObject({ message: 'DB exploded' });
  });
});

// ─── getAdminSurfShops ────────────────────────────────────────────────────────

describe('getAdminSurfShops', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns all surf shops regardless of published status', async () => {
    const all = [
      { id: '1', name_es: 'Cerritos Surf', is_published: true },
      { id: '2', name_es: 'Draft Shop',    is_published: false },
    ];
    const chain = makeChain({ data: all, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getAdminSurfShops();

    expect(result).toEqual(all);
    expect(chain.eq).not.toHaveBeenCalledWith('is_published', true);
  });

  it('returns empty array when data is null', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getAdminSurfShops()).toEqual([]);
  });
});

// ─── getAdminSurfShop ─────────────────────────────────────────────────────────

describe('getAdminSurfShop', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns the surf shop when found by id', async () => {
    const shop = { id: 'abc', name_es: 'Cerritos Surf', is_published: false };
    const chain = makeChain({ data: shop, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getAdminSurfShop('abc');

    expect(result).toEqual(shop);
    expect(chain.eq).toHaveBeenCalledWith('id', 'abc');
  });

  it('returns null when not found', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getAdminSurfShop('nonexistent')).toBeNull();
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB error' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getAdminSurfShop('any')).rejects.toMatchObject({ message: 'DB error' });
  });
});
