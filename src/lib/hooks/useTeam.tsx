import { useContext } from 'react';
import { TeamContext } from '#/providers/TeamProvider';

export default function useTeam() {
  return useContext(TeamContext);
}
