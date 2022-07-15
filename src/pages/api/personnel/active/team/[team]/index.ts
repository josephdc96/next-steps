import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { getActivePersonnelByTeam } from '#/lib/personnel/active';
import { UsrSession } from '#/lib/auth/contract';

const activePersonnelByTeam = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getSession({ req });
  const { team } = req.query;

  if (!session) {
    res.status(401).end();
    return;
  }

  if (
    req.method !== 'GET' ||
    !session ||
    !(session as UsrSession).teams.includes(team as string)
  ) {
    res.status(404);
    return;
  }

  const people = await getActivePersonnelByTeam(team as string);
  const sorted = people.sort((a, b) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    if (a.firstName === b.firstName) {
      if (a.lastName < b.lastName) return -1;
      if (a.lastName > b.lastName) return 1;
      return 0;
    }
    return 0;
  });

  res.status(200).json(sorted);
};

export default activePersonnelByTeam;
