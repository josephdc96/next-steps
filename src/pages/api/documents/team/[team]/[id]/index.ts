import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '#/lib/mongo/conn';

const document = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, team } = req.query;

  if (req.method !== 'GET') {
    res.status(404).end();
    return;
  }

  const { db } = await connectToDatabase();

  const snapshot = await db
    .collection('documents')
    .findOne({ _id: id as string, teams: team });

  if (!snapshot) {
    res.status(404).end();
    return;
  }

  const doc = {
    ...(snapshot as any),
    id: snapshot._id.toString(),
  };

  res.status(200).send(doc);
};

export default document;
