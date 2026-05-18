import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { getSeoForPage } from '../queries';

const mockedCreateClient = vi.mocked(createClient);

function makeChain(result: { data: unknown; error: unknown }) {
  const promise = Promise.resolve(result);
  const chain: any = Object.assign(promise, {
    select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn(),
  });
  for (const key of Object.keys(chain)) chain[key].mockReturnValue(chain);
  return chain;
}

function makeClient(chain: ReturnType<typeof makeChain>) {
  return { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<ReturnType<typeof createClient>>;
}

describe('getSeoForPage', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns the seo entry when it exists', async () => {
    const seo = { page: 'home', title_es: 'Cerritos Beach', title_en: 'Cerritos Beach' };
    const chain = makeChain({ data: seo, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getSeoForPage('home');

    expect(result).toEqual(seo);
    expect(chain.eq).toHaveBeenCalledWith('page', 'home');
  });

  it('returns null when no entry exists for the page', async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    expect(await getSeoForPage('comunidad')).toBeNull();
  });

  it('throws when the database returns an error', async () => {
    const chain = makeChain({ data: null, error: { message: 'DB error' } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getSeoForPage('home')).rejects.toMatchObject({ message: 'DB error' });
  });
});
