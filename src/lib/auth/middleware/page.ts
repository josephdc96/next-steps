// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextFetchEvent, NextRequest } from 'next/server';
import type { JWT } from 'next-auth/jwt';
import type { Asset } from '#/lib/auth/contract';

import { withAuth } from 'next-auth/middleware';

import { SeshAuthzr } from '#/lib/auth/middleware/middleware';

type MiddlewareFunction = (
  req: NextRequest,
  res: NextFetchEvent,
) => Promise<any>;

export function PageRequiresAuthz(asset: Asset): MiddlewareFunction {
  const authorize = SeshAuthzr(asset);
  return withAuth({
    callbacks: {
      authorized({ token }: { token: JWT | null }) {
        return authorize(token);
      },
    },
  }) as MiddlewareFunction;
}
