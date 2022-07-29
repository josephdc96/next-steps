import type { NextApiRequest, NextApiResponse } from 'next';
import type { Personnel } from '#/types/personnel';

import { getSession, useSession } from 'next-auth/react';
import { UserRole } from '#/types/personnel';
import { getTeamPositions } from '#/lib/positions/positions';
import { getActivePersonnelByTeam } from '#/lib/personnel/active';
import type { UsrSession } from '#/lib/auth/contract';

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
  const { team } = req.query;
  const session = await getSession({ req });

  if (
    req.method !== 'GET' ||
    !session ||
    !(session as UsrSession).teams.includes(team as string)
  ) {
    res.status(404).end();
    return;
  }

  const personnel = await getActivePersonnelByTeam(team as string);
  const positions = await getTeamPositions(team as string);
  const assignments = new Map<string | undefined, string[]>();

  positions.forEach((position) => {
    assignments.set(position.id || '', []);
  });
  assignments.set(undefined, []);

  personnel.forEach((person) => {
    let id: string | undefined;
    if (
      (person.roles &&
        !person.roles.includes(UserRole.TeamLeader) &&
        !person.roles.includes(UserRole.Admin)) ||
      !person.roles
    ) {
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
