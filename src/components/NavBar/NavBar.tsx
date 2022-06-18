import type { Personnel } from '../../types/personnel';
import type { NavBarRoute } from '#/types/navbar-item';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NavBarItem } from '#/components/NavBar/NavBarItem';
import FeedbackModal from '#/components/FeedbackModal/FeedbackModal';

import useStyles from './NavBar.styles';

interface NavBarProps {
  opened: boolean;
}

export const NavBar = ({ opened }: NavBarProps) => {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { data: session } = useSession();
  const [person, setPerson] = useState<Personnel | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [navbarItems, setNavbarItems] = useState<NavBarRoute[]>([]);

  useEffect(() => {
    if (session) {
      fetch(`/api/personnel/active/auth0/${session?.id}`).then((x) => {
        x.json()
          .then((json) => {
            setPerson(json);
          })
          .catch((err) => {
            setPerson({
              firstName: session.user?.name,
              lastName: '',
            } as Personnel);
          });
      });
      fetch('/api/me/routes').then((x) => {
        x.json().then((json) => {
          setNavbarItems(json);
        });
      });
    }
  }, [session]);

  return (
    <>
      <Navbar
        width={{ base: 275 }}
        p="md"
        hiddenBreakpoint="sm"
        hidden={!opened}
      >
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
                {navbarItems.map((item) => (
                  <NavBarItem
                    key={item.caption}
                    caption={item.caption}
                    icon={item.icon}
                    path={item.path}
                  />
                ))}
                <NavBarItem
                  caption="Feedback"
                  icon="envelope"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                />
              </Group>
            </>
          )}
        </Navbar.Section>
        <Navbar.Section>
          <Divider />
          <Space h="sm" />
          {person && session && (
            <Group spacing="xs" noWrap>
              <Center className={classes.user} aria-label="user">
                <Box className={classes.userInfo}>
                  <Group>
                    <Avatar radius="md" color="blue" src={session?.user?.image}>
                      {`${person?.firstName?.at(0)}${person?.lastName?.at(0)}`}
                    </Avatar>
                    <div>
                      <Text size="md">
                        {`${`${person?.firstName} ${person?.lastName}`.substring(
                          0,
                          9,
                        )}...`}
                      </Text>
                      <Text size="xs">
                        {`${session?.user?.email?.substring(0, 12)}...`}
                      </Text>
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
                <FontAwesomeIcon
                  icon={colorScheme === 'dark' ? 'moon' : 'sun'}
                />
              </Button>
            </Group>
          )}
          {(!person || !session) && (
            <Button onClick={() => signIn()} style={{ width: '100%' }}>
              Log In
            </Button>
          )}
        </Navbar.Section>
      </Navbar>
      <FeedbackModal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </>
  );
};
