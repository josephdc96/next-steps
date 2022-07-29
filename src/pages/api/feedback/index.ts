import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';
import { connectToDatabase } from '#/lib/mongo/conn';

const sendFeedback = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end();
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const { db } = await connectToDatabase();

  const body = JSON.parse(req.body);
  body.date = new Date();

  await db.collection('feedback').insertOne(body);
  res.status(200).end();
};

export default sendFeedback;
