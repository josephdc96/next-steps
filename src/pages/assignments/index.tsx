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
import { MobileHeader } from '#/components/MobileHeader/MobileHeader';
import ManualAssignment from '#/components/ManualAssignment/ManualAssignment';
import AutomaticAssignment from '#/components/AutomaticAssignment/AutomaticAssignment';
import { HeaderButton } from '#/components/MobileHeader/HeaderButton';
import { useMediaQuery } from '@mantine/hooks';
import useTeam from '#/lib/hooks/useTeam';

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
  const { teamId } = useTeam();
  const isMobile = useMediaQuery('(max-width: 800px)');

  const [editModal, setEditModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Position | undefined>(undefined);
  const [manualAssignmentVisible, setManualAssignmentVisible] = useState(false);
  const [automaticAssignmentVisible, setAutomaticAssignmentVisible] =
    useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const { data, error, isValidating, mutate } = useSWR(
    [`/api/positions/team/${teamId}`],
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
      <MobileHeader
        right={
          <>
            {canEdit && (
              <Group spacing="md">
                <Menu>
                  <Menu.Target>
                    <Button
                      radius="xl"
                      leftIcon={
                        isMobile ? undefined : (
                          <FontAwesomeIcon icon={'arrows-rotate'} />
                        )
                      }
                    >
                      <>
                        {!isMobile && <>New Assignments</>}
                        {isMobile && <FontAwesomeIcon icon="arrows-rotate" />}
                      </>
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => setManualAssignmentVisible(true)}>
                      Manually Assign
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => setAutomaticAssignmentVisible(true)}
                    >
                      Automatically Assign
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <HeaderButton
                  caption="New Position"
                  icon="plus"
                  onClick={() => newPosition()}
                />
              </Group>
            )}
          </>
        }
      />
      <Center style={{ width: '100%', marginTop: isMobile ? 20 : 80 }}>
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
