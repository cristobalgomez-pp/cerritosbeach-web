import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Locale = 'es' | 'en';
export type MemberType = 'visitor' | 'resident' | 'local';
export type UserRole = 'member' | 'moderator' | 'admin';

export type CurrentUserState = {
  user: { id: string; email: string } | null;
  profile: {
    username: string | null;
    display_name: string | null;
    member_type: MemberType | null;
    locale: Locale | null;
    role: UserRole;
    is_approved: boolean;
  } | null;
};

/**
 * Returns the current user + profile state. Cached per-request via React cache(),
 * so multiple calls within a single render (e.g. Navbar + page) share one fetch.
 */
export const getCurrentUserState = cache(async (): Promise<CurrentUserState> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, member_type, locale, role, is_approved')
    .eq('id', user.id)
    .single();

  return {
    user: { id: user.id, email: user.email },
    profile: profile
      ? {
          username: profile.username,
          display_name: profile.display_name,
          member_type: profile.member_type as MemberType | null,
          locale: profile.locale as Locale | null,
          role: (profile.role ?? 'member') as UserRole,
          is_approved: profile.is_approved ?? false,
        }
      : null,
  };
});
