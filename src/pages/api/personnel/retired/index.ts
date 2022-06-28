import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../types/personnel';
import type { Position } from '../../../../types/position';

import { getSession } from 'next-auth/react';
import { connectToDatabase } from '#/lib/mongo/conn';

const onBreakPersonnel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const { db } = await connectToDatabase();

  if (req.method === 'PUT') {
    const doc = await db
      .collection('personnel')
      .updateOne(
        { _id: id as string },
        { $set: { active: false, ...JSON.parse(req.body) } },
      );
    res.status(200).end();
  }

  if (req.method === 'GET') {
    const snapshot = await db.collection('personnel').find({ active: false });

    const people: Personnel[] = [];
    const positions: Map<string, Position> = new Map();

    const snap2 = await db.collection('positions').find({});
    await snap2.forEach((position) => {
      positions.set(position._id.toString(), {
        ...position.data(),
      } as Position);
    });

    await snapshot.forEach((person) => {
      const p: Personnel = {
        ...(person as any),
        id: person.id,
        currentMonthAssign: person.currentMonthAssign
          ? positions.get(person.currentMonthassign)
          : undefined,
        lastMonthAssign: person.lastMonthAssign
          ? positions.get(person.lastMonthAssign)
          : undefined,
        leader: person.leader,
      } as Personnel;
      people.push(p);
    });

    const sorted = people.sort((a, b) => {
      if (a.firstName < b.firstName) return -1;
      if (a.firstName > b.firstName) return 1;
      if (a.firstName === b.firstName) {
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;
        return 0;
      }
      return 0;
    });

    res.status(200).json(sorted);
  }

  res.status(418).end();
};

export default onBreakPersonnel;
