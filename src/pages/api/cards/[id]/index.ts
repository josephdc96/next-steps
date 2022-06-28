import type { NextApiRequest, NextApiResponse } from 'next';

import { deleteCardInDb, updateCardInDb } from '#/lib/cards/getCard';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method !== 'DELETE' && req.method !== 'PUT') {
    res.status(404).end();
  }

  if (req.method === 'DELETE') {
    await deleteCardInDb(id as string);
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    const body = JSON.parse(req.body);
    body.dob = new Date(body.dob);
    body.date = new Date(body.date);

    await updateCardInDb(id as string, body);
    res.status(200).end();
    return;
  }

  res.status(418).end();
};

export default handler;
