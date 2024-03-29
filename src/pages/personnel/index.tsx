import type { Fetcher } from 'swr';
import type { Personnel } from '#/types/personnel';

import useSWR from 'swr';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { useMediaQuery } from '@mantine/hooks';
import {
  ActionIcon,
  Anchor,
  Box,
  Center,
  Group,
  Loader,
  Menu,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserModal from '#/components/UserModal/UserModal';
import RetireModal from '#/components/RetireModal/RetireModal';
import { MobileHeader } from '#/components/MobileHeader/MobileHeader';
import { HeaderButton } from '#/components/MobileHeader/HeaderButton';
import BreakModal from '#/components/BreakModal/BreakModal';

import { UserRole } from '#/types/personnel';
import useTeam from '#/lib/hooks/useTeam';

const fetcher: Fetcher<Personnel[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

export default function PersonnelPage() {
  const theme = useMantineTheme();
  const [view, setView] = useState('active');
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState<Personnel | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [changeId, setChangeId] = useState('');
  const [breakVisible, setBreakVisible] = useState(false);
  const [retireVisible, setRetireVisible] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { teamId } = useTeam();
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const is300 = useMediaQuery('(max-width: 350px)');
  const { data: session } = useSession();

  const newUser = () => {
    setEditModal(false);
    setModalData(undefined);
    setModalVisible(true);
  };

  const editUser = (user: Personnel) => {
    setEditModal(true);
    setModalData(user);
    setModalVisible(true);
  };

  const breakUser = (id: string) => {
    setChangeId(id);
    setBreakVisible(true);
  };

  const unBreakUser = (id: string) => {};

  const retireUser = (id: string) => {
    setChangeId(id);
    setRetireVisible(true);
  };

  const refresh = () => {
    mutate();
  };

  const { data, error, isValidating, mutate } = useSWR(
    [`/api/personnel/${view}/team/${teamId}`],
    fetcher,
  );

  const rows = !data ? (
    <></>
  ) : (
    data.map((person) => {
      const getLeader = (leader: string): string => {
        let name = 'Unknown';

        data.forEach((x) => {
          if (x.id === leader) name = `${x.firstName} ${x.lastName}`;
        });
        return name;
      };

      const today = dayjs(Date.now());
      const diff = dayjs(person.birthday).diff(today, 'year');
      const leader = person.leader ? getLeader(person.leader) : 'None';

      return (
        <tr
          key={person.id}
          style={{
            fontWeight:
              person.roles?.includes(UserRole.TeamLeader) ||
              person.roles?.includes(UserRole.Admin)
                ? 'bold'
                : 'normal',
            fontStyle:
              person.roles?.includes(UserRole.SubTeamLeader) ||
              person.roles?.includes(UserRole.Admin)
                ? 'italic'
                : 'normal',
          }}
        >
          <td>{`${person.firstName} ${person.lastName}`}</td>
          <td>
            <Anchor href={`tel:${person.phoneNum}`}>{person.phoneNum}</Anchor>
          </td>
          <td>{dayjs(person.commitedThru).format('MMM YYYY')}</td>
          <td>{dayjs(person.signedCommitment).format('MMM YYYY')}</td>
          <td>{dayjs(person.ltClass).format('MMM YYYY')}</td>
          <td>{dayjs(person.birthday).format('M/D/YYYY')}</td>
          <td>
            <Anchor href={`mailto:${person.email}`}>{person.email}</Anchor>
          </td>
          <td>{-diff}</td>
          {view === 'active' && <td>{leader}</td>}
          {view !== 'active' && <td>{person.reason}</td>}
          {view !== 'active' && view !== 'break' && <td>{person.followUp}</td>}
          <td>
            <Group spacing="xs">
              <Menu>
                <Menu.Target>
                  <ActionIcon>
                    <FontAwesomeIcon icon="ellipsis-v" />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<FontAwesomeIcon icon={'edit'} />}
                    onClick={() => editUser(person)}
                  >
                    Edit
                  </Menu.Item>
                  {view === 'active' && (
                    <Menu.Item
                      icon={<FontAwesomeIcon icon={'bed'} />}
                      onClick={() => breakUser(person.id || '')}
                    >
                      On Break
                    </Menu.Item>
                  )}
                  {view === 'active' && !person.accountActive && (
                    <Menu.Item icon={<FontAwesomeIcon icon="refresh" />}>
                      Resend Activation Email
                    </Menu.Item>
                  )}
                  {view === 'break' && (
                    <Menu.Item
                      icon={<FontAwesomeIcon icon="person-circle-check" />}
                      onClick={() => unBreakUser(person.id || '')}
                    >
                      Reactivate User
                    </Menu.Item>
                  )}
                  {(view === 'active' || view === 'break') && (
                    <Menu.Item
                      icon={<FontAwesomeIcon icon={'user-slash'} />}
                      color="red"
                      onClick={() => retireUser(person.id || '')}
                    >
                      Retire
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
              {!person.accountActive && (
                <Tooltip label="Account inactive">
                  <FontAwesomeIcon icon="exclamation-triangle" color="yellow" />
                </Tooltip>
              )}
            </Group>
          </td>
        </tr>
      );
    })
  );

  return (
    <>
      <MobileHeader
        center={
          !is300 ? (
            <TextInput
              placeholder="Search"
              style={{ width: '35%', maxWidth: 800 }}
              icon={<FontAwesomeIcon icon="search" />}
            />
          ) : undefined
        }
        right={
          <Group spacing="sm" noWrap>
            {is300 && <HeaderButton icon="search" caption="Search" />}
            <HeaderButton
              icon="user-plus"
              caption="Add Person"
              onClick={() => newUser()}
            />
            <HeaderButton
              color="green"
              disabled
              caption="Export to CSV"
              icon="file-excel"
              onClick={() => {}}
            />
          </Group>
        }
      />
      <Center style={{ width: '100%', marginTop: isMobile ? 20 : 80 }}>
        <Stack spacing="md" style={{ width: '80%' }}>
          <Box style={{ width: '100%' }}>
            <Group position="apart" style={{ width: '100%' }}>
              <Title order={3}>Personnel</Title>
              <SegmentedControl
                data={[
                  { label: 'Active', value: 'active' },
                  { label: 'On Break', value: 'break' },
                  { label: 'Retired', value: 'retired' },
                ]}
                value={view}
                onChange={setView}
              />
            </Group>
          </Box>
          <Box
            style={{
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 300px)',
              width: '100%',
            }}
          >
            {data && !error && !isValidating && (
              <Table>
                <thead
                  style={{
                    top: 0,
                    zIndex: 2,
                    position: 'sticky',
                    backgroundColor:
                      colorScheme === 'dark'
                        ? theme.colors.dark[8]
                        : theme.colors.gray[1],
                  }}
                >
                  <tr>
                    <th>Name</th>
                    <th>Phone Num.</th>
                    <th>Committed Thru</th>
                    <th>Signed Comm.</th>
                    <th>LT Class</th>
                    <th>Birthday</th>
                    <th>Email</th>
                    <th>Age</th>
                    {view === 'active' && <th>Leader</th>}
                    {view !== 'active' && <th>Reason</th>}
                    {view !== 'active' && view !== 'break' && (
                      <th>Follow Up</th>
                    )}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            )}
            {isValidating && (
              <Center>
                <Loader />
              </Center>
            )}
          </Box>
          <Text size="xs">
            Legend: <b>Bold: Team Leader</b> | <i>Italics: Subteam Leader</i> |{' '}
            <b>
              <i>Bold Italics: Paradigm Staff Member</i>
            </b>
          </Text>
        </Stack>
      </Center>
      <UserModal
        isEdit={editModal}
        opened={modalVisible}
        user={modalData}
        onClose={() => {
          setModalVisible(false);
          refresh();
        }}
      />
      <BreakModal
        userId={changeId}
        opened={breakVisible}
        onClose={() => {
          setBreakVisible(false);
          refresh();
        }}
      />
      <RetireModal
        userId={changeId}
        opened={retireVisible}
        onClose={() => {
          setRetireVisible(false);
          refresh();
        }}
      />
    </>
  );
}
