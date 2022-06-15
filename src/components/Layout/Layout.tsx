import type { ReactNode } from 'react';
import type { MantineTheme, ColorScheme } from '@mantine/core';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { setCookies } from 'cookies-next';
import { useMediaQuery } from '@mantine/hooks';
import { AppShell, ColorSchemeProvider, MantineProvider } from '@mantine/core';

import { NavBar } from '#/components/NavBar/NavBar';

import { MobileHeader } from '../MobileHeader/MobileHeader';
import { themeObject } from '../../styles/theme';
import { signIn, useSession } from 'next-auth/react';

interface LayoutProps {
  children: ReactNode;
  colorScheme: ColorScheme;
}

export const Layout = ({ children, colorScheme }: LayoutProps) => {
  const [opened, setOpened] = useState(false);
  const matches = useMediaQuery('(max-width: 800px)');

  const router = useRouter();

  const [currentColorScheme, setColorScheme] =
    useState<ColorScheme>(colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (currentColorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const { data: session, status } = useSession();

  if (!session && status !== 'loading') {
    signIn();
    return <></>;
  }

  return (
    <>
      <ColorSchemeProvider
        colorScheme={currentColorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: currentColorScheme,
            ...themeObject,
          }}
        >
          <AppShell
            navbar={<NavBar opened={opened} />}
            fixed
            navbarOffsetBreakpoint="sm"
            sx={(theme: MantineTheme) => ({
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[2],
            })}
            header={
              matches ? (
                <MobileHeader
                  opened={opened}
                  setOpened={setOpened}
                  showBurger
                />
              ) : undefined
            }
          >
            {children}
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};
