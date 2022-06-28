import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateCardInDb } from '#/lib/cards/getCard';

const completeCard = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, status } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method !== 'PUT') {
    res.status(404).end();
    return;
  }

  await updateCardInDb(id as string, { completed: status === 'true' });
  res.status(200).end();
};

export default completeCard;
