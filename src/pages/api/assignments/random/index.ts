import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '../../../../types/personnel';

import { getPositions } from '#/lib/positions/positions';
import { getActivePersonnel } from '#/lib/personnel/active';

const randomAssignments = async (req: NextApiRequest, res: NextApiResponse) => {
  const getAssignment = (person: Personnel, nestedIndex: number): string => {
    const rand = Math.floor(Math.random() * positions.length);
    const position = positions.at(rand);
    if (person.currentMonthAssign === position?.id && nestedIndex < 4) {
      return getAssignment(person, nestedIndex + 1);
    }
    if (
      (assignments.get(position?.id || '')?.length || 0) >=
        personnel.length / positions.length &&
      nestedIndex < 4
    ) {
      return getAssignment(person, nestedIndex + 1);
    }
    return position?.id || '';
  };

  if (req.method !== 'GET') {
    res.status(404).end();
    return;
  }

  const personnel = await getActivePersonnel();
  const positions = await getPositions();
  const assignments = new Map<string | undefined, string[]>();

  positions.forEach((position) => {
    assignments.set(position.id || '', []);
  });
  assignments.set(undefined, []);

  personnel.forEach((person) => {
    let id: string | undefined;
    if (!person.teamLead) {
      id = getAssignment(person, 1);
    }
    const team = assignments.get(id) || [];
    team.push(person.id || '');
    assignments.set(id, team);
  });

  const result: { id: string; position?: string }[] = [];
  assignments.forEach((value, key) => {
    value.forEach((id) => {
      result.push({ id, position: key });
    });
  });

  res.status(200).send(JSON.stringify(result));
};

export default randomAssignments;
