import type { NextApiRequest, NextApiResponse } from 'next';
import { getActivePersonnel } from '#/lib/personnel/active';
import { getSession } from 'next-auth/react';

const activePersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const { include_admin } = req.query;

  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

  const people = await getActivePersonnel(!!include_admin);
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

export default activePersonnel;
