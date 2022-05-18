import type { Personnel } from '../../types/personnel';
import { Card, Group, Text } from '@mantine/core';
import { useState } from 'react';

interface subteamCardProps {
  leaders: Personnel[];
  name: string
}

export default function SubteamCard({ leaders, name }: subteamCardProps) {
  const [members, setMembers] = useState<Personnel[]>([]);

  return (
    <Card shadow="sm" p="lg">
      <Group direction="column" spacing="md">
        <Text size="lg">{name}</Text>
        <Text>Leaders</Text>
        {leaders.map((leader) => {
          return (
            <Text
              key={leader.id}
              size="sm"
            >{`${leader.firstName} ${leader.lastName}`}</Text>
          );
        })}
        <Text>Members</Text>
        {members.map((member) => {
          return (
            <Text
              key={member.id}
              size="sm"
            >{`${member.firstName} ${member.lastName}`}</Text>
          );
        })}
      </Group>
    </Card>
  )
}