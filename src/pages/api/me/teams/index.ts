import type { NextApiRequest, NextApiResponse } from 'next';
import type { UsrSession } from '#/lib/auth/contract';

import { getSession } from 'next-auth/react';

import { getMyTeams, getTeams } from '#/lib/teams/getTeams';
import type { Team } from '#/types/team';
import { UserRole } from '#/types/personnel';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    let teams: Team[];
    if (
      (session as UsrSession).roles.includes(UserRole.SuperUser) ||
      (session as UsrSession).roles.includes(UserRole.Admin)
    ) {
      teams = await getTeams();
    } else {
      teams = await getMyTeams((session as UsrSession).teams);
    }
    res.status(200).send(teams);
    return;
  }

  res.status(404).end();
};

export default handler;
