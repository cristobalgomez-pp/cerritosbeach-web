import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { needsOnboarding } from '../server';

const mockedCreateClient = vi.mocked(createClient);

function makeChain(result: { data: unknown; error: unknown }) {
  const chain: any = Object.assign(Promise.resolve(result), {
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn().mockResolvedValue(result),
  });
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  return chain;
}

function makeClient(profileResult: { data: unknown; error: unknown }) {
  return {
    from: vi.fn().mockReturnValue(makeChain(profileResult)),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-abc', email: 'user@test.com' } },
      }),
    },
  } as unknown as Awaited<ReturnType<typeof createClient>>;
}

describe('needsOnboarding', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns true when the profile has no username', async () => {
    mockedCreateClient.mockResolvedValue(
      makeClient({ data: { username: null }, error: null })
    );

    const result = await needsOnboarding();

    expect(result).toBe(true);
  });

  it('returns false when the profile already has a username', async () => {
    mockedCreateClient.mockResolvedValue(
      makeClient({ data: { username: 'cristobal_g' }, error: null })
    );

    const result = await needsOnboarding();

    expect(result).toBe(false);
  });

  it('returns true when no authenticated user exists', async () => {
    const client = makeClient({ data: null, error: null });
    (client.auth.getUser as any).mockResolvedValue({ data: { user: null } });
    mockedCreateClient.mockResolvedValue(client);

    const result = await needsOnboarding();

    expect(result).toBe(true);
  });
});
