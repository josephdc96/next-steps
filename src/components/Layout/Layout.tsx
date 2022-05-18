import type { ReactNode } from 'react';
import type { MantineTheme } from '@mantine/core';

import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AppShell } from '@mantine/core';

import { NavBar } from '#/components/NavBar/NavBar';

import { MobileHeader } from '../MobileHeader/MobileHeader';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [opened, setOpened] = useState(false);
  const matches = useMediaQuery('(max-width: 800px)');

  return (
    <>
      <AppShell
        navbar={<NavBar opened={opened} />}
        fixed
        navbarOffsetBreakpoint="sm"
        sx={(theme: MantineTheme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
        })}
        header={
          matches ? (
            <MobileHeader opened={opened} setOpened={setOpened} />
          ) : undefined
        }
      >
        {children}
      </AppShell>
    </>
  );
};
