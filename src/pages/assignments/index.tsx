import { useEffect, useState } from 'react';
import { Position } from '../../types/position';
import { Affix, Button, Center, Group, Loader, Menu, SimpleGrid } from '@mantine/core';
import SubteamCard from '#/components/SubteamCard/SubteamCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubteamModal from '#/components/SubteamModal/SubteamModal';
import { Subteam } from '../../types/subteam';
import PositionCard from '#/components/PositionCard/PositionCard';
import PositionModal from '#/components/PositionModal';
import ManualAssignment from '#/components/ManualAssignment/ManualAssignment';
import AutomaticAssignment from '#/components/AutomaticAssignment/AutomaticAssignment';
import useSWR, { Fetcher } from 'swr';

const fetcher: Fetcher<Position[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

export default function AssignmentsPage() {
  const [editModal, setEditModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Position | undefined>(undefined);
  const [manualAssignmentVisible, setManualAssignmentVisible] = useState(false);
  const [automaticAssignmentVisible, setAutomaticAssignmentVisible] = useState(false);

  const { data, error, isValidating, mutate } = useSWR(
    ['/api/positions'],
    fetcher,
  );

  const newPosition = () => {
    setEditModal(false);
    setModalData(undefined);
    setModalVisible(true);
  };

  const editPosition = (position: Position) => {
    setEditModal(true);
    setModalData(position);
    setModalVisible(true);
  };

  const refresh = () => {
    mutate();
  };

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <SimpleGrid
          cols={3}
          style={{ width: '80%' }}
          breakpoints={[
            { maxWidth: 'xs', cols: 1 },
            { maxWidth: 'sm', cols: 2 },
            { maxWidth: 'md', cols: 1 },
            { maxWidth: 'lg', cols: 2 },
          ]}
        >
          {data && !isValidating && !error && (
            <>
              {data.map((position, index) => {
                return (
                  <PositionCard
                    key={index}
                    position={position}
                    edit={editPosition}
                  />
                );
              })}
            </>
          )}
          {isValidating && (
            <>
              <Loader />
            </>
          )}
        </SimpleGrid>
      </Center>
      <Affix position={{ right: 20, bottom: 20 }}>
        <Group spacing="md">
          <Menu
            control={
              <Button
                radius="xl"
                leftIcon={<FontAwesomeIcon icon="arrows-rotate" />}
              >
                New Assignments
              </Button>
            }
          >
            <Menu.Item onClick={() => setManualAssignmentVisible(true)}>
              Manually Assign
            </Menu.Item>
            <Menu.Item onClick={() => setAutomaticAssignmentVisible(true)}>
              Automatically Assign
            </Menu.Item>
          </Menu>
          <Button
            radius="xl"
            leftIcon={<FontAwesomeIcon icon="plus" />}
            onClick={() => newPosition()}
          >
            New Position
          </Button>
        </Group>
      </Affix>
      <PositionModal
        isEdit={editModal}
        opened={modalVisible}
        position={modalData}
        onClose={() => {
          setModalVisible(false);
          refresh();
        }}
      />
      <ManualAssignment
        opened={manualAssignmentVisible}
        onClose={() => {
          setManualAssignmentVisible(false);
          refresh();
        }}
      />
      <AutomaticAssignment
        opened={automaticAssignmentVisible}
        onClose={() => {
          setAutomaticAssignmentVisible(false);
          refresh();
        }}
      />
    </>
  );
}
