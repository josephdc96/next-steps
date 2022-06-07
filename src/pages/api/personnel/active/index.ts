import type { NextApiRequest, NextApiResponse } from 'next';
import { getActivePersonnel } from '#/lib/personnel/active';
import { getSession } from 'next-auth/react';

const activePersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

  const people = await getActivePersonnel();

  res.status(200).json(people);
};

export default activePersonnel;
