import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@google-cloud/firestore';
import { Cards } from '../../../../../../types/cards';

const weeksCardData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { year, month } = req.query;

  if (req.method !== 'GET') {
    res.status(404).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const snapshot = await db.collection(`/cards/${year}/${month}`).get();

  const cards: Cards[] = [];

  snapshot.forEach((card) => {
    const data = card.data();
    const c: Cards = {
      ...data,
    } as Cards;
    cards.push(c);
  });

  res.status(200).json(cards);
};

export default weeksCardData;

