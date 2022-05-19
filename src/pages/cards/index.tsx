import { Box, Button, Center, Group, Header, Text, Title, useMantineTheme } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CardsOverviewPage() {
  const theme = useMantineTheme();

  return (
    <>
      <Box style={{ backgroundColor: theme.colors.dark[8], height: 60 }}>
        <Center style={{ width: '100%', height: '100%' }}>
          <Group position="apart" style={{ width: '100%', paddingLeft: 5, paddingRight: 5 }}>
            <span />
            <Title order={3}>Overview</Title>
            <Group spacing="sm">
              <Button variant="subtle">
                <FontAwesomeIcon icon="plus" />
              </Button>
            </Group>
          </Group>
        </Center>
      </Box>
    </>
  )
}