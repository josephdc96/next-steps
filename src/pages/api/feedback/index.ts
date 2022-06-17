import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';
import { Firestore } from '@google-cloud/firestore';

const sendFeedback = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
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

  const body = JSON.parse(req.body);
  body.date = new Date();

  await db.collection('feedback').add(body);
  res.status(200).end();
};

export default sendFeedback;
