import { Affix, Box, Button, Center, Group, SimpleGrid } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { Subteam } from '../../types/subteam';
import SubteamCard from '#/components/SubteamCard/SubteamCard';
import SubteamModal from '#/components/SubteamModal/SubteamModal';
import { Personnel } from '../../types/personnel';

export default function SubteamsPage() {
  const [data, setData] = useState<Subteam[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [modalData, setModalData] = useState<Subteam | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);

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
    fetch('/api/subteams').then((x) => {
      x.json().then((json) => {
        setData(json);
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
          {data.map((subteam, index) => {
            return (
              <SubteamCard key={index} subteam={subteam} edit={editSubteam} />
            );
          })}
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
