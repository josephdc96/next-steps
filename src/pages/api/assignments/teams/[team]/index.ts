import type { NextApiRequest, NextApiResponse } from 'next';
import type { UpdateResult } from 'mongodb';

import { getSession } from 'next-auth/react';

import { connectToDatabase } from '#/lib/mongo/conn';

const assignments = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const body: {
    id: string;
    position: string | undefined;
    currentPosition: string | undefined;
  }[] = JSON.parse(req.body);

  const { db } = await connectToDatabase();

  const fns: Promise<UpdateResult>[] = [];
  body.forEach((x) => {
    fns.push(
      db.collection('personnel').updateOne(
        { _id: x.id },
        {
          $set: {
            lastMonthAssign: x.currentPosition || null,
            currentMonthAssign: x.position || null,
          },
        },
      ),
    );
  });
  await Promise.allSettled(fns);
  res.status(200).end();
};

export default assignments;
