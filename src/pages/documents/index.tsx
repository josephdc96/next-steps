import type { Fetcher } from 'swr';
import type { Document } from '#/types/documents';
import useSWR from 'swr';
import {
  Button,
  Card,
  Center,
  createStyles,
  Grid,
  Group,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import useTeam from '#/lib/hooks/useTeam';

const fetcher: Fetcher<Document[], string[]> = async (url: string) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

interface DocumentCardProps {
  card: Document;
}

const DocumentCard = ({ card }: DocumentCardProps) => {
  const theme = useMantineTheme();

  const getColor = (): string => {
    switch (card.icon) {
      case 'file-word':
        return theme.colors.blue[6];
      case 'file-excel':
        return theme.colors.green[6];
      default:
        return theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[8];
    }
  };

  return (
    <Link href={`/documents/${card.id}`} passHref>
      <Card
        component="a"
        styles={{
          width: 160,
          height: 150,
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[4]
              : theme.colors.gray[0],
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[3]
                : theme.colors.gray[2],
          },
          padding: theme.spacing.sm,
        }}
      >
        <Center style={{ width: '100%', height: '100%', textAlign: 'center' }}>
          <Group direction="column" grow>
            <FontAwesomeIcon
              icon={card.icon}
              fontSize={64}
              color={getColor()}
            />
            <Text size="md">{card.name}</Text>
          </Group>
        </Center>
      </Card>
    </Link>
  );
};

export default function DocumentsPage() {
  const { teamId } = useTeam();
  const { data, error, isValidating } = useSWR(
    [`/api/documents/team/${teamId}`],
    fetcher,
  );

  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }}>
          <Title order={3}>Documents</Title>
          <Grid style={{ width: '100%' }}>
            {data && !error && !isValidating && (
              <>
                {data.map((doc) => {
                  return (
                    <Grid.Col span={2} key={doc.name}>
                      <DocumentCard card={doc} />
                    </Grid.Col>
                  );
                })}
              </>
            )}
          </Grid>
        </Group>
      </Center>
    </>
  );
}
