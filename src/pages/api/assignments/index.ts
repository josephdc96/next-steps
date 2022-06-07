import type { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@google-cloud/firestore';
import { getSession } from 'next-auth/react';

const assignments = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }

  const body: {
    id: string;
    position: string | undefined;
    currentPosition: string | undefined;
  }[] = JSON.parse(req.body);

  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  body.forEach((x) => {
    const doc = db.collection('personnel').doc(x.id);
    doc.update({
      lastMonthAssign: x.currentPosition || null,
      currentMonthAssign: x.position || null,
    });
  });
  res.status(200).end();
};

export default assignments;
