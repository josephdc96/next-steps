import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { getPositions } from '#/lib/positions/positions';
import { connectToDatabase } from '#/lib/mongo/conn';

const apiPositions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    const positions = await getPositions();

    res.status(200).send(JSON.stringify(positions));
    return;
  }

  res.status(404).end();
};

export default apiPositions;
