import type { NextApiRequest, NextApiResponse } from 'next';
import type { Document } from '#/types/documents';

import { connectToDatabase } from '#/lib/mongo/conn';

const documentsByTeam = async (req: NextApiRequest, res: NextApiResponse) => {
  const { team } = req.query;

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    const body: Document = JSON.parse(req.body);

    res.status(200).end();
    return;
  }

  const snapshot = db.collection('documents').find({ teams: team });

  const docs: Document[] = [];
  await snapshot.forEach((document) => {
    const newDoc = {
      ...(document as any),
      id: document._id.toString(),
    } as Document;
    docs.push(newDoc);
  });
  res.status(200).send(docs);
};

export default documentsByTeam;
