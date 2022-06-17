import type { NextApiHandler } from 'next';
import type { Asset } from '#/lib/auth/contract';
import { getSession } from 'next-auth/react';
import { ActAuthzr } from '#/lib/auth/middleware/middleware';

export function ApiRequiresAuthz(
  handler: NextApiHandler,
  action: string,
  asset: Asset,
) {
  const handleAuthz: NextApiHandler = async function handle(req, res) {
    const session = await getSession({ req });
    const authorize = ActAuthzr(session, asset);
    if (authorize()) {
      return handler(req, res);
    }
    return res.status(403).send({
      error: 'access denied',
    });
  };

  return handleAuthz;
}
