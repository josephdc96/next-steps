import useSWR, { Fetcher } from 'swr';
import { ActionIcon, Button, Center, Group, Title } from '@mantine/core';
import type { Document } from '../../../types/documents';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DocumentsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<Document | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/documents/${id}`).then((x) => {
      x.json().then((json) => {
        setData(json);
      });
    });
  });

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }}>
          {data && (
            <>
              <Group spacing="md">
                <ActionIcon
                  color="blue"
                  size="lg"
                  radius="xl"
                  variant="outline"
                  component="a"
                  href="/documents"
                >
                  <FontAwesomeIcon icon="caret-left" />
                </ActionIcon>
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
        </Group>
      </Center>
    </>
  );
}
