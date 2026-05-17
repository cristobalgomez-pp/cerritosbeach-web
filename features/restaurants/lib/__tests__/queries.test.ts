import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { getRestaurants, getAdminRestaurants, getAdminRestaurant } from '../queries';

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

// ─── getRestaurants ───────────────────────────────────────────────────────────

describe('getRestaurants', () => {
  beforeEach(() => vi.resetAllMocks());

  it('queries only published restaurants ordered by featured desc', async () => {
    const restaurants = [
      { id: '1', name_es: 'El Nido', featured: true,  is_published: true },
      { id: '2', name_es: 'Tacos',   featured: false, is_published: true },
    ];
    const chain = makeChain({ data: restaurants, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getRestaurants();

    expect(result).toEqual(restaurants);
    expect(chain.eq).toHaveBeenCalledWith('is_published', true);
    expect(chain.order).toHaveBeenCalledWith('featured', { ascending: false });
  });

  it('returns empty array when data is null', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getRestaurants()).toEqual([]);
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB exploded' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getRestaurants()).rejects.toMatchObject({ message: 'DB exploded' });
  });
});

// ─── getAdminRestaurants ──────────────────────────────────────────────────────

describe('getAdminRestaurants', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns all restaurants regardless of published status', async () => {
    const all = [
      { id: '1', name_es: 'El Nido', is_published: true },
      { id: '2', name_es: 'Draft',   is_published: false },
    ];
    const chain = makeChain({ data: all, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getAdminRestaurants();

    expect(result).toEqual(all);
    expect(chain.eq).not.toHaveBeenCalledWith('is_published', true);
  });

  it('returns empty array when data is null', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getAdminRestaurants()).toEqual([]);
  });
});

// ─── getAdminRestaurant ───────────────────────────────────────────────────────

describe('getAdminRestaurant', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns the restaurant when found by id', async () => {
    const restaurant = { id: 'abc', name_es: 'El Nido', is_published: false };
    const chain = makeChain({ data: restaurant, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getAdminRestaurant('abc');

    expect(result).toEqual(restaurant);
    expect(chain.eq).toHaveBeenCalledWith('id', 'abc');
  });

  it('returns null when not found', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getAdminRestaurant('nonexistent')).toBeNull();
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB error' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getAdminRestaurant('any')).rejects.toMatchObject({ message: 'DB error' });
  });
});
