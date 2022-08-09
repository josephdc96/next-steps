import { Button, Center, Group, Stack, Text, Title } from '@mantine/core';

import CreateCard from '#/components/CreateCard/CreateCard';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateCardPage() {
  const [complete, setComplete] = useState(false);

  return (
    <>
      <Center style={{ width: '100%' }}>
        <Stack spacing="md" style={{ width: '80%' }}>
          <Title order={1}>Welcome to Paradigm!</Title>
          {!complete && (
            <>
              <Text>
                {
                  "We're glad you're here! Please fill out our Next Steps card so we have a record of your visit!"
                }
              </Text>
              <CreateCard isEdit={false} onSubmit={() => setComplete(true)} />
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
        </Stack>
      </Center>
    </>
  );
}
