import type { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  Burger,
  createStyles,
  Group,
  Header,
  Image,
  MediaQuery,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import useMobile from '#/lib/hooks/useMobile';

interface MobileHeaderProps {
  hideBurger?: boolean;
  center?: ReactNode;
  right?: ReactNode;
}

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
}));

export const MobileHeader = ({
  hideBurger,
  center,
  right,
}: MobileHeaderProps) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const matches = useMediaQuery('(max-width: 1200px)');
  const is375 = useMediaQuery('(max-width: 375px)');
  const { opened, setOpened } = useMobile();

  return (
    <Header height={60} px="md" py="0">
      <Group className={classes.header} position="apart">
        {!hideBurger && matches && (
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
            data-testid={'hamburger'}
          />
        )}
        {(hideBurger || !matches) && <span />}
        {center && <>{center}</>}
        {!center && !is375 && (
          <Image
            src={
              colorScheme === 'dark'
                ? '/Paradigm_Branding_Logo-white.png'
                : '/Paradigm_Branding_Logo-black.png'
            }
            style={{
              maxWidth: 140,
            }}
            alt="Paradigm Logo"
            height={40}
          />
        )}
        {!center && is375 && <span />}
        {right && <>{right}</>}
        {!right && <span />}
      </Group>
    </Header>
  );
};
