import { connectToDatabase } from '#/lib/mongo/conn';
import { NextStepsCard } from '#/types/new-here';

export const updateCardInDb = async (id: string, body: any) => {
  const { db } = await connectToDatabase();
  console.log(process.env.NODE_ENV);

  const doc = await db
    .collection('cards')
    .updateOne({ _id: id }, { $set: body });
};

export const deleteCardInDb = async (id: string) => {
  const { db } = await connectToDatabase();

  const doc = await db.collection('cards').deleteOne({ _id: id });
};
