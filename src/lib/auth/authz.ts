import type { Asset, Authz } from '#/lib/auth/contract';

import { UserRole } from '#/types/personnel';
import { Authorized, Unauthorized } from '#/lib/auth/audit';

export function authorizeAction(asset: Asset, roles: UserRole[]): Authz {
  if (roles.includes(UserRole.SuperUser)) {
    return Authorized(asset, 'user is a superuser');
  }

  if (userOwns(asset, roles)) {
    if (userCan(asset, roles)) {
      return Authorized(asset, 'user owns asset and user has ability');
    }
    return Unauthorized(
      asset,
      'user owns asset but user does not have ability',
    );
  }
  return Unauthorized(asset, 'user does not own asset');
}

export function userOwns(asset: Asset, roles: UserRole[]) {
  return true;
}

export function userCan(asset: Asset, roles: UserRole[]) {
  let can = false;
  asset.role.forEach((role) => {
    if (roles.includes(role)) can = true;
  });
  return can;
}
