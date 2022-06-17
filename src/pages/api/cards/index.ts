import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextStepsCard } from '../../../types/new-here';

import { getSession } from 'next-auth/react';
import { Firestore } from '@google-cloud/firestore';

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
    const { sort, sortDirection, startDate, endDate, host, completed, boxes } =
      req.query;

    const snapshot = await db.collection('cards').get();

    const cards: NextStepsCard[] = [];

    snapshot.forEach((card) => {
      const data = card.data();
      const date: Date = data.date.toDate();
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
        ...data,
        dob: data.dob.toDate(),
        date: data.date.toDate(),
        id: card.id,
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

    res.status(200).json(sorted);
  }

  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    console.log(body);
    body.dob = new Date(body.dob);
    body.date = new Date(body.date);

    await db.collection('cards').add(body);
    res.status(200).end();
  }
};

export default getCards;
