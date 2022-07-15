import type { NextApiRequest, NextApiResponse } from 'next';
import { getTeamPositions } from '#/lib/positions/positions';
import { connectToDatabase } from '#/lib/mongo/conn';
import { getSession } from 'next-auth/react';
import { UsrSession } from '#/lib/auth/contract';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { team, id } = req.query;
  const session = await getSession({ req });

  if (!session || !(session as UsrSession).teams.includes(team as string)) {
    res.status(404).end();
  }

  if (req.method === 'GET') {
    const positions = await getTeamPositions(team as string);

    res.status(200).send(JSON.stringify(positions));
    return;
  }

  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    await db
      .collection('positions')
      .insertOne({ name: req.body, teams: [team] });
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

export default handler;
