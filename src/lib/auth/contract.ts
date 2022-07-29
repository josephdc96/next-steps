import type { Session } from 'next-auth';
import type { UserRole } from '#/types/personnel';

export interface UsrSession extends Session {
  roles: UserRole[];
  teams: string[];
}

export type UsrJwt = {
  roles: UserRole[];
};

export type Asset = {
  role: UserRole[];
};

export type Authz = {
  asset: Asset;
  authorized: boolean;
  reason: string;
  timestamp: string;
};
