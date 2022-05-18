import { Affix, Button, Center, SimpleGrid } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SubteamsPage() {
  return (
    <>
      <Center style={{ width: '100%', marginTop: 80 }}>
        <SimpleGrid cols={3} style={{ width: '80%' }}>
        </SimpleGrid>
      </Center>
      <Affix position={{ right: 20, bottom: 20 }}>
        <Button leftIcon={<FontAwesomeIcon icon="plus" />}>New Subteam</Button>
      </Affix>
    </>
  );
}
