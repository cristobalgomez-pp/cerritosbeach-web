import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { completeOnboarding, signOut } from '../actions';

const mockedCreateClient = vi.mocked(createClient);

// Builds a chain whose terminal awaited value is `result`.
// All builder methods return the same chain so callers can freely chain .eq/.neq/etc.
function makeChain(result: { data: unknown; error: unknown }) {
  const chain: any = Object.assign(Promise.resolve(result), {
    select: vi.fn(),
    eq: vi.fn(),
    neq: vi.fn(),
    update: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue(result),
    single: vi.fn().mockResolvedValue(result),
  });
  for (const key of Object.keys(chain)) {
    if (typeof chain[key]?.mockReturnValue === 'function') {
      chain[key].mockReturnValue(chain);
    }
  }
  return chain;
}

// Builds a Supabase client where:
//   - first call to .from() returns `checkChain`  (username uniqueness check)
//   - second call to .from() returns `updateChain` (profile update)
function makeClient(
  checkResult: { data: unknown; error: unknown },
  updateResult: { data: unknown; error: unknown } = { data: null, error: null }
) {
  const checkChain  = makeChain(checkResult);
  const updateChain = makeChain(updateResult);
  return {
    from: vi.fn()
      .mockReturnValueOnce(checkChain)   // 1st from() → username check
      .mockReturnValueOnce(updateChain), // 2nd from() → update
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-abc' } } }),
    },
  } as unknown as Awaited<ReturnType<typeof createClient>>;
}

// ─── completeOnboarding ───────────────────────────────────────────────────────

describe('completeOnboarding', () => {
  beforeEach(() => vi.resetAllMocks());

  function makeFormData(fields: Record<string, string>) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.append(k, v);
    return fd;
  }

  const VALID_FIELDS = { username: 'cristobal_g', displayName: 'Cristóbal G.' };

  it('returns NOT_AUTHENTICATED when no session', async () => {
    const client = makeClient({ data: null, error: null });
    (client.auth.getUser as any).mockResolvedValue({ data: { user: null } });
    mockedCreateClient.mockResolvedValue(client);

    const result = await completeOnboarding(makeFormData(VALID_FIELDS));

    expect(result).toMatchObject({ status: 'error', code: 'NOT_AUTHENTICATED' });
  });

  it('returns INVALID_INPUT when username is missing', async () => {
    mockedCreateClient.mockResolvedValue(makeClient({ data: null, error: null }));

    const result = await completeOnboarding(makeFormData({ displayName: 'Cristóbal' }));

    expect(result).toMatchObject({ status: 'error', code: 'INVALID_INPUT' });
  });

  it('returns USERNAME_TAKEN when another profile has the same username', async () => {
    // checkChain resolves to an existing profile
    mockedCreateClient.mockResolvedValue(
      makeClient({ data: { id: 'other-user' }, error: null })
    );

    const result = await completeOnboarding(makeFormData(VALID_FIELDS));

    expect(result).toMatchObject({ status: 'error', code: 'USERNAME_TAKEN' });
  });

  it('does NOT include locale in the DB update', async () => {
    const client = makeClient({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(client);

    await completeOnboarding(makeFormData(VALID_FIELDS));

    // Grab the second `from()` call (the update chain) and inspect what update() received
    const updateChain = (client.from as ReturnType<typeof vi.fn>).mock.results[1]?.value;
    expect(updateChain.update).toHaveBeenCalledWith(
      expect.not.objectContaining({ locale: expect.anything() })
    );
  });

  it('returns success when update succeeds', async () => {
    mockedCreateClient.mockResolvedValue(makeClient({ data: null, error: null }));

    const result = await completeOnboarding(makeFormData(VALID_FIELDS));

    expect(result).toMatchObject({ status: 'success' });
  });

  it('returns SUPABASE_ERROR when DB update fails', async () => {
    mockedCreateClient.mockResolvedValue(
      makeClient(
        { data: null, error: null },                          // check: no conflict
        { data: null, error: { message: 'unique constraint' } } // update: fails
      )
    );

    const result = await completeOnboarding(makeFormData(VALID_FIELDS));

    expect(result).toMatchObject({ status: 'error', code: 'SUPABASE_ERROR' });
  });
});

// ─── signOut ─────────────────────────────────────────────────────────────────

describe('signOut', () => {
  beforeEach(() => vi.resetAllMocks());

  function makeAuthClient() {
    return {
      auth: { signOut: vi.fn().mockResolvedValue({}) },
    } as unknown as Awaited<ReturnType<typeof createClient>>;
  }

  it('redirects to / (home) for es locale', async () => {
    mockedCreateClient.mockResolvedValue(makeAuthClient());
    await signOut('es');
    expect(vi.mocked(redirect)).toHaveBeenCalledWith('/');
  });

  it('redirects to /en (home) for en locale', async () => {
    mockedCreateClient.mockResolvedValue(makeAuthClient());
    await signOut('en');
    expect(vi.mocked(redirect)).toHaveBeenCalledWith('/en');
  });
});
