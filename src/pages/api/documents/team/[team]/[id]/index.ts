import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '#/lib/mongo/conn';
import type { UsrSession } from '#/lib/auth/contract';
import { getSession } from 'next-auth/react';

const document = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, team } = req.query;
  const session = await getSession({ req });

  if (
    req.method !== 'GET' ||
    !session ||
    !(session as UsrSession).teams.includes(team as string)
  ) {
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
