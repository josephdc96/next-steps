import {
  Affix,
  Box,
  Button,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Skeleton,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import type { Subteam } from '../../types/subteam';
import SubteamCard from '#/components/SubteamCard/SubteamCard';
import SubteamModal from '#/components/SubteamModal/SubteamModal';
import { Personnel } from '../../types/personnel';
import type { Fetcher } from 'swr';
import useSWR from 'swr';

const fetcher: Fetcher<Subteam[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

export default function SubteamsPage() {
  const theme = useMantineTheme();
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState<Subteam | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);

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
        <Button
          radius="xl"
          leftIcon={<FontAwesomeIcon icon="plus" />}
          onClick={() => newSubteam()}
        >
          New Subteam
        </Button>
      </Affix>
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
