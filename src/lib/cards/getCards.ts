import type { NextStepsCard } from '#/types/new-here';

import clientPromise from '#/lib/mongo/conn';

export const getCardsFromDb = async ({
  sort,
  sortDirection,
  startDate,
  endDate,
  host,
  completed,
  boxes,
}: any): Promise<NextStepsCard[]> => {
  const client = await clientPromise;

  const docs = client.db('next-steps').collection('cards').find({});

  const cards: NextStepsCard[] = [];

  await docs.forEach((card) => {
    const data = card;
    const { date } = data;
    if (
      date < new Date(startDate as string) ||
      date > new Date(endDate as string)
    ) {
      return;
    }

    if (host && typeof host === 'string') {
      if (data.whoHelped !== host) return;
    } else if (host) {
      if (!(host as string[]).includes(data.whoHelped)) return;
    }

    if (boxes && typeof boxes === 'string') {
      if (!data.reasons.includes(Number.parseInt(boxes, 10))) return;
    } else if (boxes) {
      let valid = false;
      (boxes as string[]).forEach((box) => {
        if (data.reasons.includes(Number.parseInt(box, 10))) valid = true;
      });
      if (!valid) return;
    }

    if (completed && typeof completed === 'string' && completed === 'true') {
      if (!data.completed) return;
    }

    const c: NextStepsCard = {
      ...(data as any),
      id: card._id.toString(),
    } as NextStepsCard;
    cards.push(c);
  });

  let sorted = cards.sort((a, b) => {
    switch (sort as string) {
      case 'name':
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      case 'phonenum':
        if (a.phoneNum > b.phoneNum) return 1;
        if (a.phoneNum < b.phoneNum) return -1;
        return 0;
      case 'address':
        if (a.address > b.address) return 1;
        if (a.address < b.address) return -1;
        return 0;
      case 'gender':
        if (a.gender > b.gender) return 1;
        if (a.gender < b.gender) return -1;
        return 0;
      case 'host':
        if (!a.whoHelped && !b.whoHelped) return 0;
        if (!a.whoHelped) return -1;
        if (!b.whoHelped) return 1;
        if (a.whoHelped > b.whoHelped) return 1;
        if (a.whoHelped < b.whoHelped) return -1;
        return 0;
      case 'date':
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;
      default:
        return 0;
    }
  });

  if (sortDirection === 'descending') {
    sorted = sorted.reverse();
  }

  return sorted;
};
