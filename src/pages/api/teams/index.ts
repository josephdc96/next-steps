import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { getTeams } from '#/lib/teams/getTeams';
import { connectToDatabase } from '#/lib/mongo/conn';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    const teams = await getTeams();
    res.status(200).send(teams);
    return;
  }

  res.status(404).end();
};

export default handler;
