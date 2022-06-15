import { Center, Group, Text, Title } from '@mantine/core';

import CreateCard from '#/components/CreateCard/CreateCard';

export default function CreateCardPage() {
  return (
    <>
      <Center style={{ width: '100%' }}>
        <Group direction="column" spacing="md" style={{ width: '80%' }} grow>
          <Title order={1}>Welcome to Paradigm!</Title>
          <Text>
            {
              "We're glad you're here! Please fill out our Next Steps card so we have a record of your visit!"
            }
          </Text>
          <CreateCard />
        </Group>
      </Center>
    </>
  );

}