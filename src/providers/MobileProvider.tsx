import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

export type MobileNavState = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

const MOBILE_NAV_STATE_DEFAULT: MobileNavState = {
  opened: false,
  setOpened: () => {},
};

export const MobileNav = createContext<MobileNavState>(
  MOBILE_NAV_STATE_DEFAULT,
);

export function MobileProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);

  function setOpen(isOpen: boolean) {
    setOpened(isOpen);
  }

  const context: MobileNavState = {
    opened,
    setOpened: setOpen,
  };

  return <MobileNav.Provider value={context}>{children}</MobileNav.Provider>;
}
