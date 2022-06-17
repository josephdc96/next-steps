import type { Fetcher } from 'swr';
import type { Subteam } from '#/types/subteam';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Affix, Button, Center, Loader, SimpleGrid } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SubteamModal from '#/components/SubteamModal/SubteamModal';
import SubteamCard from '#/components/SubteamCard/SubteamCard';
import type { Asset, UsrSession } from '#/lib/auth/contract';
import { UserRole } from '#/types/personnel';
import { authorizeAction } from '#/lib/auth/authz';
import { useSession } from 'next-auth/react';

const fetcher: Fetcher<Subteam[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

const editAsset: Asset = {
  role: [UserRole.Admin, UserRole.TeamLeader, UserRole.SubTeamLeader],
};

export default function SubteamsPage() {
  const { data: session } = useSession();

  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState<Subteam | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const { data, error, isValidating, mutate } = useSWR(
    ['/api/subteams'],
    fetcher,
  );

  const newSubteam = () => {
    setEditModal(false);
    setModalData(undefined);
    setModalVisible(true);
  };

  const editSubteam = (subteam: Subteam) => {
    setEditModal(true);
    setModalData(subteam);
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
          {data && !error && !isValidating && (
            <>
              {data.map((subteam, index) => {
                return (
                  <SubteamCard
                    key={index}
                    subteam={subteam}
                    edit={editSubteam}
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
          <Button
            radius="xl"
            leftIcon={<FontAwesomeIcon icon="plus" />}
            onClick={() => newSubteam()}
          >
            New Subteam
          </Button>
        </Affix>
      )}
      <SubteamModal
        isEdit={editModal}
        opened={modalVisible}
        subteam={modalData}
        onClose={() => {
          setModalVisible(false);
          refresh();
        }}
      />
    </>
  );
}
