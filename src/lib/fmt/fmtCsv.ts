import type { NextStepsCard } from '#/types/new-here';

import dayjs from 'dayjs';

import { GENDER_DISPLAY_RECORD, Reasons } from '#/types/new-here';
import { getSingleUserById } from '#/lib/personnel/single';
import type { Personnel } from '#/types/personnel';

export const fmtCardsToCsv = async (
  cards: NextStepsCard[],
): Promise<string> => {
  let file =
    'Name,Gender,DOB,Phone #,Email,Address,City,State,Zip,First Time,Follow Jesus,Baptism,Membership,Discipleship,Serve,Group Connect,Prayer Requests,Confidential,Host';
  for (let i = 0; i < cards.length; i += 1) {
    const card = cards.at(i);
    if (!card) break;
    let line = `${card.name},${GENDER_DISPLAY_RECORD[card.gender]},${dayjs(
      card.dob,
    ).format('DD/MM/YYYY')},${card.phoneNum},${card.email},${card.address},${
      card.city
    }, ${card.state}, ${card.zip}`;
    line = `${line},${card.reasons.includes(Reasons.firstTime) ? '*' : ''}`;
    line = `${line},${card.reasons.includes(Reasons.followJesus) ? '*' : ''}`;
    line = `${line},${card.reasons.includes(Reasons.baptism) ? '*' : ''}`;
    line = `${line},${card.reasons.includes(Reasons.membership) ? '*' : ''}`;
    line = `${line},${card.reasons.includes(Reasons.discipleship) ? '*' : ''}`;
    line = `${line},${card.reasons.includes(Reasons.serve) ? '*' : ''}`;
    line = `${line},${card.reasons.includes(Reasons.joinGroup) ? '*' : ''}`;
    line = `${line},${card.prayerRequests}`;
    line = `${line},${card.confidential ? '*' : ''}`;
    if (card.whoHelped) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const p = await getSingleUserById(card.whoHelped);
        line = `${line},${p.firstName} ${p.lastName}`;
      } catch (e) {
        line = `${line},${card.whoHelped} (Unknown Host)`;
      }
    } else if (card.otherHelp) {
      line = `${line},${card.otherHelp}`;
    } else {
      line = `${line},No host listed`;
    }

    file = `${file}\r\n${line}`;
  }
  return file;
};
