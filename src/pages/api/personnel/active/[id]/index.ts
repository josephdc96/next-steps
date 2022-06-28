import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { getSingleUserById } from '#/lib/personnel/single';

const getPerson = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(404).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(404);
    return;
  }

  const personnel = await getSingleUserById(id as string);

  res.status(200).json(personnel);
};

export default getPerson;
