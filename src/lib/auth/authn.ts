import type { JWT } from 'next-auth/jwt';
import type { NextAuthOptions, Session } from 'next-auth';
import type { UsrJwt, UsrSession } from '#/lib/auth/contract';

export function hasRoles(jwt: JWT | Partial<UsrJwt> | null): jwt is UsrJwt {
  if (jwt) {
    const { roles = [] } = jwt;
    return Array.isArray(roles);
  }
  return false;
}
