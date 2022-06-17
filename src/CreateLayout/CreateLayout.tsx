import type { ReactNode } from 'react';
import { useState } from 'react';
import type { ColorScheme, MantineTheme } from '@mantine/core';
import { AppShell, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { setCookies } from 'cookies-next';
import { themeObject } from '../styles/theme';
import { MobileHeader } from '#/components/MobileHeader/MobileHeader';

interface LayoutProps {
  children: ReactNode;
  colorScheme: ColorScheme;
}

export const CreateLayout = ({ children, colorScheme }: LayoutProps) => {
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

  return (
    <>
      <ColorSchemeProvider
        colorScheme={colorScheme}
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
            fixed
            sx={(theme: MantineTheme) => ({
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[2],
            })}
            header={<MobileHeader opened={false} setOpened={() => {}} />}
          >
            {children}
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};
