import type { Subteam } from '../../types/subteam';
import type { Personnel } from '../../types/personnel';

import { useEffect, useState } from 'react';
import { Button, Card, Group, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface subteamCardProps {
  subteam: Subteam;
  edit(subteam: Subteam): void;
}

export default function SubteamCard({ subteam, edit }: subteamCardProps) {
  const [members, setMembers] = useState<Personnel[]>([]);
  const [leaders, setLeaders] = useState<Personnel[]>([]);

  useEffect(() => {
    setMembers([]);
    setLeaders([]);
    fetch(`/api/personnel/active/leaders?leaders=${subteam.leaders}`).then(
      (x) => {
        x.json().then((json: Personnel[]) => {
          setLeaders(json);
          fetch(`/api/personnel/teams/members?leaders=${subteam.leaders}`).then(
            (y) => {
              y.json().then((json2: Personnel[]) => {
                console.log(json2);
                setMembers(json2);
              });
            },
          );
        });
      },
    );
  }, [subteam]);

  return (
    <Card
      shadow="sm"
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[0],
      })}
    >
      <Group direction="column" spacing="md">
        <Group position="apart" style={{ width: '100%' }}>
          <Text size="xl">{subteam.name}</Text>
          <Group spacing="xs">
            <Button variant="subtle" onClick={() => edit(subteam)}>
              <FontAwesomeIcon icon="edit" />
            </Button>
            <Button variant="subtle" color="red">
              <FontAwesomeIcon icon="trash" />
            </Button>
          </Group>
        </Group>
        <Text size="lg">Leaders</Text>
        {leaders.map((leader) => {
          return (
            <Text
              key={leader.id}
              size="sm"
            >{`${leader.firstName} ${leader.lastName}`}</Text>
          );
        })}
        <Text size="lg">Members</Text>
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
  );
}
