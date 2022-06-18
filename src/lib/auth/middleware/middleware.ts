import type { Session } from 'next-auth';
import type { Asset } from '#/lib/auth/contract';

import { authorizeAction } from '#/lib/auth/authz';
import { hasRoles } from '#/lib/auth/authn';
import type { JWT } from 'next-auth/jwt';

export function ActAuthzr(claimed: Session | JWT | null, asset: Asset) {
  return function authorize(): boolean {
    if (hasRoles(claimed)) {
      const { roles } = claimed;
      const authz = authorizeAction(asset, roles);
      if (authz.authorized) {
        return true;
      }
      return false;
    }
    return false;
  };
}

export function SeshAuthzr(asset: Asset) {
  console.log('SeshAuthzr');
  return function authorize(claimed: Session | JWT | null): boolean {
    console.log(claimed);
    console.log(hasRoles(claimed));
    if (hasRoles(claimed)) {
      const { roles } = claimed;
      const authz = authorizeAction(asset, roles);
      console.log(authz);
      if (authz.authorized) {
        return true;
      }
      return false;
    }
    return false;
  };
}
