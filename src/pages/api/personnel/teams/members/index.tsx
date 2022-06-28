import type { NextApiRequest, NextApiResponse } from 'next';
import type { Position } from '#/types/position';
import type { Personnel } from '#/types/personnel';

import { getSession } from 'next-auth/react';

import { connectToDatabase } from '#/lib/mongo/conn';

const getTeamMembers = async (req: NextApiRequest, res: NextApiResponse) => {
  const { leaders } = req.query;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    const { db } = await connectToDatabase();

    const snapshot = db.collection('personnel').find({
      active: true,
      onBreak: false,
    });

    const people: Personnel[] = [];
    const positions: Map<string, Position> = new Map();

    const snap2 = await db.collection('positions').find({});
    await snap2.forEach((position) => {
      positions.set(position._id.toString(), {
        ...(position as any),
      } as Position);
    });

    await snapshot.forEach((person) => {
      if (!(leaders as string[]).includes(person.leader)) return;

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
  } else {
    res.status(404).end();
  }
};

export default getTeamMembers;
