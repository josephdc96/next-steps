import type { Personnel } from '../../types/personnel';

import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Affix,
  Box,
  Button,
  Center,
  Group,
  Menu,
  SegmentedControl,
  Table,
  Text,
  Title, Tooltip, useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserModal from '#/components/UserModal/UserModal';
import RetireModal from '#/components/RetireModal/RetireModal';
import BreakModal from '#/components/BreakModal/BreakModal';

export default function PersonnelPage() {
  const theme = useMantineTheme();
  const [data, setData] = useState<Personnel[]>([]);
  const [view, setView] = useState('active');
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState<Personnel | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [changeId, setChangeId] = useState('');
  const [breakVisible, setBreakVisible] = useState(false);
  const [retireVisible, setRetireVisible] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();


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

  const unBreakUser = (id: string) => {

  }

  const retireUser = (id: string) => {
    setChangeId(id);
    setRetireVisible(true);
  };

  const refresh = useCallback(() => {
    fetch(`/api/personnel/${view}`).then((x) => {
      x.json().then((json) => {
        const data2 = json.sort((a: Personnel, b: Personnel) => {
          if (a.firstName > b.firstName) return 1;
          if (a.firstName < b.firstName) return 1;
          if (a.lastName > b.lastName) return 1;
          if (a.lastName < b.lastName) return -1;
          return 0;
        });
        setData(data2);
      });
    });
  }, [view]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rows = data.map((person) => {
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
          fontWeight: person.teamLead ? 'bold' : 'normal',
          fontStyle: person.subteamLead ? 'italic' : 'normal',
        }}
      >
        <td>{`${person.firstName} ${person.lastName}`}</td>
        <td>{person.phoneNum}</td>
        <td>{dayjs(person.commitedThru).format('MMM YYYY')}</td>
        <td>{dayjs(person.signedCommitment).format('MMM YYYY')}</td>
        <td>{dayjs(person.ltClass).format('MMM YYYY')}</td>
        <td>{dayjs(person.birthday).format('M/D/YYYY')}</td>
        <td>{person.email}</td>
        <td>{-diff}</td>
        {view === 'active' && <td>{leader}</td>}
        {view !== 'active' && <td>{person.reason}</td>}
        {view !== 'active' && view !== 'break' && <td>{person.followUp}</td>}
        <td>
          <Menu>
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
          </Menu>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }}>
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
              overflowX: 'scroll',
              overflowY: 'scroll',
              maxHeight: 'calc(100vh - 300px)',
              width: '100%',
            }}
          >
            <Table>
              <thead
                style={{
                  top: 0,
                  zIndex: 2,
                  position: 'sticky',
                  backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
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
                  {view !== 'active' && view !== 'break' && <th>Follow Up</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Box>
          <Text size="xs">
            Legend: <b>Bold: Team Leader</b> | <i>Italics: Subteam Leader</i>
          </Text>
        </Group>
      </Center>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button
          radius="xl"
          leftIcon={<FontAwesomeIcon icon={'user-plus'} />}
          onClick={() => newUser()}
        >
          Add Person
        </Button>
      </Affix>
      <Affix position={{ bottom: 20, left: 295 }}>
        <Tooltip label="Coming soon">
          <Button
            color="green"
            disabled
            radius="xl"
            leftIcon={<FontAwesomeIcon icon={'file-excel'} />}
          >
            Export to CSV
          </Button>
        </Tooltip>
      </Affix>
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
