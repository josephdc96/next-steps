import type { Dispatch, SetStateAction } from 'react';

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

interface MobileHeaderProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  showBurger?: boolean;
}

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
}));

export const MobileHeader = ({
  opened,
  setOpened,
  showBurger,
}: MobileHeaderProps) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const matches = useMediaQuery('(min-width: 214px)');

  return (
    <Header height={60} px="md" py="0">
      <Group className={classes.header} position="apart">
        {showBurger && (
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
              data-testid={'hamburger'}
            />
          </MediaQuery>
        )}
        {!showBurger && <span />}
        {matches && (
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
        <span />
      </Group>
    </Header>
  );
};
