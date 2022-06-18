import { UserRole } from '#/types/personnel';
import type { Asset, Authz } from '#/lib/auth/contract';
import type { JWT } from 'next-auth/jwt';

type Clock = () => Date;

export function Authorized(
  asset: Asset,
  reason: string,
  clock: Clock = () => new Date(),
): Authz {
  return {
    asset,
    authorized: true,
    reason,
    timestamp: clock().toISOString(),
  };
}

export function Unauthorized(
  asset: Asset,
  reason: string,
  clock: Clock = () => new Date(),
): Authz {
  return {
    asset,
    authorized: false,
    reason,
    timestamp: clock().toISOString(),
  };
}

/**
 * Format authorization audit that client is unauthenticated.
 */
export function Unauthenticated(
  asset: Asset,
  token: JWT | null,
  clock: Clock = () => new Date(),
): Authz {
  return {
    asset,
    authorized: false,
    reason: 'Unauthenticated',
    timestamp: clock().toISOString(),
  };
}
