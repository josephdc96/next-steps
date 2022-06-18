import type { Personnel } from '../../types/personnel';

import { Firestore } from '@google-cloud/firestore';
import { UserRole } from '../../types/personnel';

export const getActivePersonnel = async (
  include_admin: boolean = false,
): Promise<Personnel[]> => {
  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db
    .collection('personnel')
    .where('active', '==', true)
    .where('onBreak', '==', false)
    .get();

  const people: Personnel[] = [];

  snapshot.forEach((person) => {
    const data = person.data();
    if (data.roles && data.roles.includes(UserRole.Admin) && !include_admin)
      return;

    const p: Personnel = {
      ...data,
      id: person.id,
      commitedThru: data.commitedThru.toDate(),
      signedCommitment: data.signedCommitment.toDate(),
      ltClass: data.ltClass.toDate(),
      birthday: data.birthday.toDate(),
      leader: data.leader,
    } as Personnel;
    people.push(p);
  });

  return people;
};
