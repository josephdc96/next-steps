/* eslint-disable prettier/prettier */
import type { NextStepsCard } from '../../types/new-here';
import type { MonthMeta } from '../../types/cards';

import { Firestore } from '@google-cloud/firestore';

import { Gender, Reasons } from '../../types/new-here';
import { initializeMeta } from '../../types/cards';

export default async function getMonth(
  year: number,
  month: number,
  monthOnly: boolean = false,
): Promise<MonthMeta> {
  const db = new Firestore({
    projectId: 'next-steps-350612',
  });

  const today = new Date();
  const weekTotals = new Map<number, number>();

  const snapshot = await db
    .collection('/cards')
    .where('year', '==', year)
    .where('month', '==', month)
    .get();

  const monthMeta = initializeMeta();

  snapshot.forEach((card) => {
    const data = card.data() as NextStepsCard;
    const date = new Date(data.date).getDate();
    weekTotals.set(date, (weekTotals.get(date) || 0) + 1);
    monthMeta.total.total += 1;
    monthMeta.male.total += data.gender === Gender.male ? 1 : 0;
    monthMeta.female.total += data.gender === Gender.female ? 1 : 0;
    monthMeta.baptism.total += data.reasons.includes(Reasons.baptism) ? 1 : 0;
    monthMeta.discipleship.total += data.reasons.includes(Reasons.discipleship)
      ? 1
      : 0;
    monthMeta.firstTime.total += data.reasons.includes(Reasons.firstTime) ? 1 : 0;
    monthMeta.followJesus.total += data.reasons.includes(Reasons.followJesus)
      ? 1
      : 0;
    monthMeta.groupConnect.total += data.reasons.includes(Reasons.joinGroup)
      ? 1
      : 0;
    monthMeta.membership.total += data.reasons.includes(Reasons.membership)
      ? 1
      : 0;
    monthMeta.serve.total += data.reasons.includes(Reasons.serve) ? 1 : 0;
    monthMeta.unmarked.total += data.reasons.length === 0 ? 1 : 0;
  });

  let totals = 0;
  weekTotals.forEach((value) => {
    totals += value;
  });
  monthMeta.average.total = weekTotals.size > 0 ? totals / weekTotals.size : 0;

  if (!monthOnly) {
    const previousMonth = await getMonth(
      month === 1 ? year - 1 : year,
      month === 1 ? 12 : month - 1,
      true,
    );

    monthMeta.total.increase =
      monthMeta.total.total - previousMonth.total.total;
    monthMeta.male.increase = monthMeta.male.total - previousMonth.male.total;
    monthMeta.female.increase =
      monthMeta.female.total - previousMonth.female.total;
    monthMeta.baptism.increase =
      monthMeta.baptism.total - previousMonth.baptism.total;
    monthMeta.discipleship.increase =
      monthMeta.discipleship.total - previousMonth.discipleship.total;
    monthMeta.firstTime.increase =
      monthMeta.firstTime.total - previousMonth.firstTime.total;
    monthMeta.followJesus.increase =
      monthMeta.followJesus.total - previousMonth.followJesus.total;
    monthMeta.groupConnect.increase =
      monthMeta.groupConnect.total - previousMonth.groupConnect.total;
    monthMeta.membership.increase =
      monthMeta.membership.total - previousMonth.membership.total;
    monthMeta.serve.increase =
      monthMeta.serve.total - previousMonth.serve.total;
    monthMeta.unmarked.increase =
      monthMeta.unmarked.total - previousMonth.unmarked.total;
    monthMeta.average.increase =
      monthMeta.average.total - previousMonth.average.total;
  }

  return monthMeta;
}
