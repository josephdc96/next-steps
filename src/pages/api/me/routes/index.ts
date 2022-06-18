import type { NextApiRequest, NextApiResponse } from 'next';
import type { NavBarRoute } from '#/types/navbar-item';

import { getSession } from 'next-auth/react';

import { authorizeAction } from '#/lib/auth/authz';
import { hasRoles } from '#/lib/auth/authn';

import { routes } from './available-routes';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (hasRoles(session)) {
    const { roles } = session;
    const myRoutes: NavBarRoute[] = [];
    routes.forEach((route) => {
      const authz = authorizeAction(route.asset, roles);
      if (authz.authorized) myRoutes.push(route);
    });
    res.status(200).json(myRoutes);
  }
  res.status(403).end();
};

export default handler;
