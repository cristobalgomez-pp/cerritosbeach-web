import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { getNewsPosts, getNewsPost } from '../queries';

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

// ─── getNewsPosts ─────────────────────────────────────────────────────────────

describe('getNewsPosts', () => {
  beforeEach(() => vi.resetAllMocks());

  it('queries only published posts ordered by published_at desc', async () => {
    const posts = [
      { id: '1', title_es: 'Post A', is_published: true, published_at: '2026-05-17' },
      { id: '2', title_es: 'Post B', is_published: true, published_at: '2026-05-16' },
    ];
    const chain = makeChain({ data: posts, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getNewsPosts();

    expect(result).toEqual(posts);
    expect(chain.eq).toHaveBeenCalledWith('is_published', true);
    expect(chain.order).toHaveBeenCalledWith('published_at', { ascending: false });
  });

  it('returns empty array when data is null', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getNewsPosts()).toEqual([]);
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB exploded' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getNewsPosts()).rejects.toMatchObject({ message: 'DB exploded' });
  });
});

// ─── getNewsPost ──────────────────────────────────────────────────────────────

describe('getNewsPost', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns the post when found by slug', async () => {
    const post = { id: '1', slug: 'primer-post', title_es: 'Primer post', is_published: true };
    const chain = makeChain({ data: post, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getNewsPost('primer-post');

    expect(result).toEqual(post);
    expect(chain.eq).toHaveBeenCalledWith('slug', 'primer-post');
    expect(chain.eq).toHaveBeenCalledWith('is_published', true);
  });

  it('returns null when the post is not found', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getNewsPost('nonexistent')).toBeNull();
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB error' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getNewsPost('any')).rejects.toMatchObject({ message: 'DB error' });
  });
});
