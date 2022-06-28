import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';
import { connectToDatabase } from '#/lib/mongo/conn';

const createPersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method !== 'POST' && req.method !== 'PUT') {
    res.status(404);
    return;
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const { db } = await connectToDatabase();

  const body = JSON.parse(req.body);
  body.signedCommitment = new Date(body.signedCommitment);
  body.ltClass = new Date(body.ltClass);
  body.commitedThru = new Date(body.commitedThru);
  body.birthday = new Date(body.birthday);

  if (req.method === 'POST') {
    await db.collection('personnel').insertOne(body);
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    const doc = await db
      .collection('personnel')
      .updateOne({ _id: id }, { $set: body });
    res.status(200).end();
    return;
  }

  res.status(418).end();
};

export default createPersonnel;
