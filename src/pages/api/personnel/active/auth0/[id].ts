import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { getSingleUserByAuth0 } from '#/lib/personnel/single';

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

  try {
    const p = await getSingleUserByAuth0(id as string);
    res.status(200).json(p);
  } catch (e) {
    res.status(404).end();
  }
};

export default getPerson;
