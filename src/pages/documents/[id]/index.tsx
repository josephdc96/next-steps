import type { Document } from '#/types/documents';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ActionIcon, Center, Group, Stack, Title } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useTeam from '#/lib/hooks/useTeam';

export default function DocumentsPage() {
  const { teamId } = useTeam();
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<Document | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/documents/team/${teamId}/${id}`).then((x) => {
      if (x.status === 404) {
        router.push('/documents');
        return;
      }
      x.json().then((json) => {
        setData(json);
      });
    });
  });

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Stack spacing="md" style={{ width: '80%' }}>
          {data && (
            <>
              <Group spacing="md">
                <Link href="/documents">
                  <ActionIcon
                    color="blue"
                    size="lg"
                    radius="xl"
                    variant="outline"
                  >
                    <FontAwesomeIcon icon="caret-left" />
                  </ActionIcon>
                </Link>
                <Title order={3}>{data.name}</Title>
              </Group>
              <iframe
                style={{
                  width: '100%',
                  height: 'calc(100vh - 208px)',
                  border: 0,
                }}
                src={data.embedURL}
              />
            </>
          )}
        </Stack>
      </Center>
    </>
  );
}
