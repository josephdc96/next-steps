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

  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const positions = await getPositions();

    res.status(200).send(JSON.stringify(positions));
    return;
  }

  if (req.method === 'POST') {
    await db.collection('positions').insertOne({ name: req.body });
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    const doc = await db
      .collection('positions')
      .updateOne({ _id: id }, { $set: { name: req.body } });
    res.status(200).end();
    return;
  }

  res.status(404).end();
};

export default apiPositions;
