import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { createClient } from '@/lib/supabase/server';
import { updateProfile, changePassword } from '../actions';

const mockedCreateClient = vi.mocked(createClient);

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

function makeUpdateChain(result: { data: unknown; error: unknown }) {
  const chain: any = Object.assign(Promise.resolve(result), {
    update: vi.fn(),
    eq: vi.fn(),
  });
  chain.update.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  return chain;
}

function makeClient({
  user = { id: 'user-abc' } as { id: string } | null,
  updateResult = { data: null, error: null } as { data: unknown; error: unknown },
  authUpdateResult = { data: {}, error: null } as { data: unknown; error: unknown },
} = {}) {
  const updateChain = makeUpdateChain(updateResult);
  return {
    from: vi.fn().mockReturnValue(updateChain),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
      updateUser: vi.fn().mockResolvedValue(authUpdateResult),
    },
  } as unknown as Awaited<ReturnType<typeof createClient>>;
}

const VALID_PROFILE = { displayName: 'Cristóbal G.', bio: 'Surfer.', locale: 'es' };
const VALID_PASSWORD = { password: 'nueva1234', confirmPassword: 'nueva1234' };

// ─── updateProfile ────────────────────────────────────────────────────────────

describe('updateProfile', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns NOT_AUTHENTICATED when no session', async () => {
    mockedCreateClient.mockResolvedValue(makeClient({ user: null }));

    const result = await updateProfile(makeFormData(VALID_PROFILE));

    expect(result).toMatchObject({ status: 'error', code: 'NOT_AUTHENTICATED' });
  });

  it('returns INVALID_INPUT when displayName is too short', async () => {
    mockedCreateClient.mockResolvedValue(makeClient());

    const result = await updateProfile(makeFormData({ displayName: 'A', locale: 'es' }));

    expect(result).toMatchObject({ status: 'error', code: 'INVALID_INPUT' });
  });

  it('returns success and persists display_name, bio and locale', async () => {
    const client = makeClient();
    mockedCreateClient.mockResolvedValue(client);

    const result = await updateProfile(makeFormData(VALID_PROFILE));

    expect(result).toMatchObject({ status: 'success' });
    const updateChain = (client.from as ReturnType<typeof vi.fn>).mock.results[0]?.value;
    expect(updateChain.update).toHaveBeenCalledWith({
      display_name: 'Cristóbal G.',
      bio: 'Surfer.',
      locale: 'es',
    });
  });

  it('returns SUPABASE_ERROR when DB update fails', async () => {
    mockedCreateClient.mockResolvedValue(
      makeClient({ updateResult: { data: null, error: { message: 'db error' } } })
    );

    const result = await updateProfile(makeFormData(VALID_PROFILE));

    expect(result).toMatchObject({ status: 'error', code: 'SUPABASE_ERROR' });
  });
});

// ─── changePassword ───────────────────────────────────────────────────────────

describe('changePassword', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns NOT_AUTHENTICATED when no session', async () => {
    mockedCreateClient.mockResolvedValue(makeClient({ user: null }));

    const result = await changePassword(makeFormData(VALID_PASSWORD));

    expect(result).toMatchObject({ status: 'error', code: 'NOT_AUTHENTICATED' });
  });

  it('returns INVALID_INPUT when password is too short', async () => {
    mockedCreateClient.mockResolvedValue(makeClient());

    const result = await changePassword(makeFormData({ password: 'short', confirmPassword: 'short' }));

    expect(result).toMatchObject({ status: 'error', code: 'INVALID_INPUT' });
  });

  it('returns PASSWORDS_MISMATCH when passwords differ', async () => {
    mockedCreateClient.mockResolvedValue(makeClient());

    const result = await changePassword(
      makeFormData({ password: 'nueva1234', confirmPassword: 'diferente' })
    );

    expect(result).toMatchObject({ status: 'error', code: 'PASSWORDS_MISMATCH' });
  });

  it('returns success and calls auth.updateUser with new password', async () => {
    const client = makeClient();
    mockedCreateClient.mockResolvedValue(client);

    const result = await changePassword(makeFormData(VALID_PASSWORD));

    expect(result).toMatchObject({ status: 'success' });
    expect(client.auth.updateUser).toHaveBeenCalledWith({ password: 'nueva1234' });
  });

  it('returns SUPABASE_ERROR when auth.updateUser fails', async () => {
    mockedCreateClient.mockResolvedValue(
      makeClient({ authUpdateResult: { data: null, error: { message: 'auth error' } } })
    );

    const result = await changePassword(makeFormData(VALID_PASSWORD));

    expect(result).toMatchObject({ status: 'error', code: 'SUPABASE_ERROR' });
  });
});
