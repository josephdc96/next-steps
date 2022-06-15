import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Firestore } from '@google-cloud/firestore';
import { NextStepsCard } from '../../../types/new-here';

const getCards = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(404).end();
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  if (req.method === 'GET') {
    const snapshot = await db
      .collection('cards')
      .get();

    const cards: NextStepsCard[] = [];

    snapshot.forEach((card) => {
      const data = card.data();
      const c: NextStepsCard = {
        ...data,
        dob: data.dob.toDate(),
        date: data.date.toDate(),
      } as NextStepsCard;
      cards.push(c);
    });

    res.status(200).json(cards);
  }
};

export default getCards;
