import type { Personnel } from '#/types/personnel';

import { UserRole } from '#/types/personnel';
import { connectToDatabase } from '#/lib/mongo/conn';

export const getActivePersonnel = async (
  include_admin: boolean = false,
): Promise<Personnel[]> => {
  const { db } = await connectToDatabase();

  const docs = db
    .collection('personnel')
    .find({ active: true, onBreak: false });

  const people: Personnel[] = [];

  await docs.forEach((data) => {
    if (data.roles && data.roles.includes(UserRole.Admin) && !include_admin)
      return;

    const p: Personnel = {
      ...(data as any),
      id: data._id,
      leader: data.leader,
    } as Personnel;
    people.push(p);
  });

  return people;
};
