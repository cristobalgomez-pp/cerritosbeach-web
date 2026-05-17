import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { getHotels, getHotel } from '../queries';

const mockedCreateClient = vi.mocked(createClient);

// Builds a chainable, awaitable Supabase query builder mock.
// All builder methods return the chain itself; awaiting it resolves to `result`.
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

// ─── getHotels ────────────────────────────────────────────────────────────────

describe('getHotels', () => {
  beforeEach(() => vi.resetAllMocks());

  it('queries only published hotels ordered by featured desc', async () => {
    const hotels = [
      { id: '1', name_es: 'Hotel A', featured: true,  is_published: true },
      { id: '2', name_es: 'Hotel B', featured: false, is_published: true },
    ];
    const chain = makeChain({ data: hotels, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getHotels();

    expect(result).toEqual(hotels);
    expect(chain.eq).toHaveBeenCalledWith('is_published', true);
    expect(chain.order).toHaveBeenCalledWith('featured', { ascending: false });
  });

  it('returns empty array when data is null', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getHotels()).toEqual([]);
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB exploded' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getHotels()).rejects.toMatchObject({ message: 'DB exploded' });
  });
});

// ─── getHotel ─────────────────────────────────────────────────────────────────

describe('getHotel', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns the hotel when found by slug', async () => {
    const hotel = { id: '1', slug: 'hacienda', name_es: 'Hacienda', is_published: true };
    const chain = makeChain({ data: hotel, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getHotel('hacienda');

    expect(result).toEqual(hotel);
    expect(chain.eq).toHaveBeenCalledWith('slug', 'hacienda');
  });

  it('returns null when the hotel is not found', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getHotel('nonexistent')).toBeNull();
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB error' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getHotel('any')).rejects.toMatchObject({ message: 'DB error' });
  });
});
