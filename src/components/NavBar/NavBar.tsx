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

interface NavBarProps {
  opened: boolean;
}

export const NavBar = ({ opened }: NavBarProps) => {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Navbar width={{ base: 275 }} p="md" hiddenBreakpoint="sm" hidden={!opened}>
      <Navbar.Section>
        <Center>
          <Image
            src={
              colorScheme === 'dark'
                ? '/Paradigm_Branding_Logo-black.png'
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
        <Space h="md" />
        <Group spacing="sm" direction="column">
          <NavBarItem caption="Home" icon="home" path="/" />
          <NavBarItem caption="Personnel" icon="person" path="/personnel" />
          <NavBarItem caption="Subteams" icon="people-group" path="/subteams" />
        </Group>
      </Navbar.Section>
      <Navbar.Section>
        <Divider />
        <Space h="sm" />
        <Button variant="subtle" className={classes.user} aria-label="user">
          <Box className={classes.userInfo}>
            <Group>
              <Avatar radius="md" color="blue" src={null}>
                JC
              </Avatar>
              <div>
                <Text size="md">Joseph Cauble</Text>
                <Text size="xs">joseph@cauble.io</Text>
              </div>
            </Group>
          </Box>
        </Button>
      </Navbar.Section>
    </Navbar>
  );
};
