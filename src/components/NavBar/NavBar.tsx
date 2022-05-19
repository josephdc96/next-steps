import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Navbar,
  ScrollArea,
  Space,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';

import { NavBarItem } from '#/components/NavBar/NavBarItem';

import useStyles from './NavBar.styles';
import { useUser } from '@auth0/nextjs-auth0';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import type { Personnel } from '../../types/personnel';

interface NavBarProps {
  opened: boolean;
}

export const NavBar = ({ opened }: NavBarProps) => {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { user, error, isLoading } = useUser();
  const [person, setPerson] = useState<Personnel | undefined>(undefined);

  useEffect(() => {
    if (user) {
      fetch(`/api/personnel/active/auth0/${user?.sub}`).then((x) => {
        x.json().then((json) => {
          setPerson(json);
        });
      });
    }
  }, [user]);

  return (
    <Navbar width={{ base: 275 }} p="md" hiddenBreakpoint="sm" hidden={!opened}>
      <Navbar.Section>
        <Center>
          <Image
            src={
              colorScheme === 'dark'
                ? '/Paradigm_Branding_Logo-white.png'
                : '/Paradigm_Branding_Logo-black.png'
            }
            alt="Paradigm Logo"
          />
        </Center>
        <Space h="sm" />
        <Center>
          <Title order={3}>Next Steps</Title>
        </Center>
        <Space h="sm" />
        <Divider />
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        {person && (
          <>
            <Space h="md" />
            <Group spacing="sm" direction="column">
              <NavBarItem caption="Home" icon="home" path="/" />
              <NavBarItem caption="Personnel" icon="person" path="/personnel" />
              <NavBarItem
                caption="Subteams"
                icon="people-group"
                path="/subteams"
              />
              <NavBarItem
                caption="Assignments"
                icon="clipboard-user"
                path="/assignments"
              />
              <NavBarItem caption="Card Data" icon="address-card" path="/cards" />
            </Group>
          </>
        )}
      </Navbar.Section>
      <Navbar.Section>
        <Divider />
        <Space h="sm" />
        {person && user && (
          <Group spacing="xs" noWrap>
            <Center className={classes.user} aria-label="user">
              <Box className={classes.userInfo}>
                <Group>
                  <Avatar radius="md" color="blue" src={user?.picture}>
                    {`${person?.firstName?.at(0)}${person?.lastName?.at(0)}`}
                  </Avatar>
                  <div>
                    <Text size="md">{`${person?.firstName} ${person?.lastName}`.substring(0, 10)}</Text>
                    <Text size="xs">{user?.email?.substring(0, 12)}</Text>
                  </div>
                </Group>
              </Box>
            </Center>
            <Button
              variant="filled"
              color={colorScheme === 'dark' ? 'blue' : 'yellow'}
              compact
              onClick={() => toggleColorScheme()}
            >
              <FontAwesomeIcon icon={colorScheme === 'dark' ? 'moon' : 'sun'} />
            </Button>
          </Group>
        )}
        {(!person || !user) && (
          <Button
            component="a"
            href="/api/auth/login"
            style={{ width: '100%' }}
          >
            Log In
          </Button>
        )}
      </Navbar.Section>
    </Navbar>
  );
};
