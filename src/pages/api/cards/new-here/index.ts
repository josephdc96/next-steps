import type { NextApiRequest, NextApiResponse } from 'next';

import { Firestore } from '@google-cloud/firestore';

const newHereCards = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const body = JSON.parse(req.body);
  body.date = new Date(body.date);
  body.dob = new Date(body.dob);
  await db.collection('cards').add(body);
  res.status(200).end();
};

export default newHereCards;
