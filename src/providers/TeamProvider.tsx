import type { ReactNode } from 'react';
import { createContext, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';

export type TeamContextState = {
  teamId: string;
  setTeamId: (teamId: string) => void;
  drawerOpened: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
};

const TEAM_CONTEXT_DEFAULT: TeamContextState = {
  teamId: '',
  setTeamId: () => {},
  drawerOpened: false,
  closeDrawer: () => {},
  openDrawer: () => {},
};

export const TeamContext =
  createContext<TeamContextState>(TEAM_CONTEXT_DEFAULT);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teamId, _setTeamId] = useLocalStorage<string>({
    key: 'selected-team',
    defaultValue: '',
  });

  const [drawerOpened, setDrawerOpened] = useState(false);

  function setTeamId(_teamId: string) {
    _setTeamId(_teamId);
    setDrawerOpened(false);
  }

  function openDrawer() {
    setDrawerOpened(true);
  }

  function closeDrawer() {
    setDrawerOpened(false);
  }

  const context: TeamContextState = {
    teamId,
    setTeamId,
    drawerOpened,
    closeDrawer,
    openDrawer,
  };

  return (
    <TeamContext.Provider value={context}>{children}</TeamContext.Provider>
  );
}
