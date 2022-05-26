import type { NextApiRequest, NextApiResponse } from 'next';
import { getActivePersonnel } from '#/lib/personnel/active';

const activePersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

  const people = await getActivePersonnel();

  res.status(200).json(people);
};

export default activePersonnel;
