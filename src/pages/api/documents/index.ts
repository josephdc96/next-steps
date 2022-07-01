import type { NextApiRequest, NextApiResponse } from 'next';
import type { Document } from '#/types/documents';

import { connectToDatabase } from '#/lib/mongo/conn';

const documents = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(404).end();
    return;
  }

  const { db } = await connectToDatabase();

  const snapshot = db.collection('documents').find({});

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

export default documents;
