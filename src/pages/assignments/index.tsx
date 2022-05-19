import { useEffect, useState } from 'react';
import { Position } from '../../types/position';
import { Affix, Button, Center, Group, Menu, SimpleGrid } from '@mantine/core';
import SubteamCard from '#/components/SubteamCard/SubteamCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubteamModal from '#/components/SubteamModal/SubteamModal';
import { Subteam } from '../../types/subteam';
import PositionCard from '#/components/PositionCard/PositionCard';
import PositionModal from '#/components/PositionModal';
import ManualAssignment from '#/components/ManualAssignment/ManualAssignment';

export default function AssignmentsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Position | undefined>(undefined);
  const [manualAssignmentVisible, setManualAssignmentVisible] = useState(false);

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
    fetch('/api/positions').then((x) => {
      x.json().then((json) => {
        setPositions(json);
      });
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <SimpleGrid cols={3} style={{ width: '80%' }}>
          {positions.map((position, index) => {
            return (
              <PositionCard
                key={index}
                position={position}
                edit={editPosition}
              />
            );
          })}
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
            <Menu.Item>Automatically Assign</Menu.Item>
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
    </>
  );
}
