import type { Position } from '#/types/position';
import type { Personnel } from '#/types/personnel';

import { connectToDatabase } from '#/lib/mongo/conn';

export const getAssignees = async (
  id: string,
  team: string,
): Promise<Personnel[]> => {
  const { db } = await connectToDatabase();

  const people: Personnel[] = [];
  const docPeople = db.collection('personnel').find({
    active: true,
    onBreak: false,
    currentMonthAssign: id,
    teams: team,
  });

  const positions: Map<string, Position> = new Map();
  const docPosition = db.collection('positions').find({ teams: team });
  await docPosition.forEach((position) => {
    positions.set(position._id.toString(), { ...(position as any) });
  });

  await docPeople.forEach((person) => {
    const p: Personnel = {
      ...(person as any),
      id: person._id,
      currentMonthAssign: person.currentMonthAssign
        ? positions.get(person.currentMonthassign)
        : undefined,
      lastMonthAssign: person.lastMonthAssign
        ? positions.get(person.lastMonthAssign)
        : undefined,
      leader: person.leader,
    };
    people.push(p);
  });

  return people;
};
