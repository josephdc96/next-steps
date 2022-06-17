import type { Fetcher } from 'swr';
import type { Position } from '#/types/position';
import type { Asset, UsrSession } from '#/lib/auth/contract';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Affix,
  Button,
  Center,
  Group,
  Loader,
  Menu,
  SimpleGrid,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UserRole } from '#/types/personnel';
import { authorizeAction } from '#/lib/auth/authz';
import PositionModal from '#/components/PositionModal';
import PositionCard from '#/components/PositionCard/PositionCard';
import ManualAssignment from '#/components/ManualAssignment/ManualAssignment';
import AutomaticAssignment from '#/components/AutomaticAssignment/AutomaticAssignment';

const fetcher: Fetcher<Position[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

const editAsset: Asset = {
  role: [UserRole.Admin, UserRole.TeamLeader, UserRole.SubTeamLeader],
};

export default function AssignmentsPage() {
  const { data: session } = useSession();

  const [editModal, setEditModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Position | undefined>(undefined);
  const [manualAssignmentVisible, setManualAssignmentVisible] = useState(false);
  const [automaticAssignmentVisible, setAutomaticAssignmentVisible] =
    useState(false);
  const [canEdit, setCanEdit] = useState(false);

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

  useEffect(() => {
    if (session) {
      setCanEdit(
        authorizeAction(editAsset, (session as UsrSession).roles).authorized,
      );
    }
  }, [session]);

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
                    canEdit={canEdit}
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
      {canEdit && (
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
      )}
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
