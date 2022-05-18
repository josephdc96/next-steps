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

interface MobileHeaderProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
}));

export const MobileHeader = ({ opened, setOpened }: MobileHeaderProps) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Header height={60} px="md" py="0">
      <Group className={classes.header} position="apart">
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
        <Image
          src={
            colorScheme === 'dark'
              ? '/Paradigm_Branding_Logo-black.png'
              : '/Paradigm_Branding_Logo-black.png'
          }
          alt="Paradigm Logo"
          height={60}
        />
        <span style={{ width: 39 }} />
      </Group>
    </Header>
  );
};
