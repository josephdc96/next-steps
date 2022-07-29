import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';
import { getCardsFromDb } from '#/lib/cards/getCards';
import { connectToDatabase } from '#/lib/mongo/conn';

const getCards = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(404).end();
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    const { sort, sortDirection, startDate, endDate, host, completed, boxes } =
      req.query;

    const cards = await getCardsFromDb({
      sort,
      sortDirection,
      startDate,
      endDate,
      host,
      completed,
      boxes,
    });

    res.status(200).json(cards);
  }

  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    const body = JSON.parse(req.body);
    body.dob = new Date(body.dob);
    body.date = new Date(body.date);

    await db.collection('cards').insertOne(body);
    res.status(200).end();
  }
};

export default getCards;
