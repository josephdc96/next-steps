import type { Personnel } from '../../types/personnel';

import { Firestore } from '@google-cloud/firestore';

export const getActivePersonnel = async (): Promise<Personnel[]> => {
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
