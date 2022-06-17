import { Button, Center, Group, Text, Title } from '@mantine/core';

import CreateCard from '#/components/CreateCard/CreateCard';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateCardPage() {
  const [complete, setComplete] = useState(false);

  return (
    <>
      <Center style={{ width: '100%' }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }} grow>
          <Title order={1}>Welcome to Paradigm!</Title>
          {!complete && (
            <>
              <Text>
                {
                  "We're glad you're here! Please fill out our Next Steps card so we have a record of your visit!"
                }
              </Text>
              <CreateCard onSubmit={() => setComplete(true)} />
            </>
          )}
          {complete && (
            <>
              <Text>
                {
                  'Thank you for filling out our Next Steps card. Be sure to grab your complimentary cup from your host!'
                }
              </Text>
              <Button component="a" href="/cards/create">
                Start Over
              </Button>
            </>
          )}
        </Group>
      </Center>
    </>
  );
}
