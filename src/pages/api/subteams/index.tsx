import type { NextApiRequest, NextApiResponse } from 'next';
import type { Subteam } from '#/types/subteam';

import { getSession } from 'next-auth/react';
import { connectToDatabase } from '#/lib/mongo/conn';

const subteams = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const snapshot = await db.collection('subteams').find({});

    const sts: Subteam[] = [];
    await snapshot.forEach((subteam) => {
      const p: Subteam = {
        id: subteam._id.toString(),
        ...(subteam as any),
      } as Subteam;
      sts.push(p);
    });

    res.status(200).json(sts);
    return;
  }

  const body = JSON.parse(req.body);
  if (req.method === 'POST') {
    await db.collection('subteams').insertOne(body);
    res.status(200).end();
  }

  if (req.method === 'PUT') {
    const doc = await db
      .collection('subteams')
      .updateOne({ _id: id }, { $set: body });
    res.status(200).end();
  }
  res.status(404).end();
};

export default subteams;
