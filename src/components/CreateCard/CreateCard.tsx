import type { Personnel } from '../../types/personnel';
import type { NextStepsCard } from '../../types/new-here';
import { REASON_DISPLAY_RECORD, Reasons, States } from '../../types/new-here';

import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import {
  Box,
  Button,
  Checkbox,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';

interface CreateCardProps {
  isEdit: boolean;
  card?: NextStepsCard;
  onSubmit(): void;
}

export default function CreateCard({
  isEdit,
  card,
  onSubmit,
}: CreateCardProps) {
  const form = useForm({
    initialValues: {
      name: card?.name || '',
      gender: (card?.gender === 1 ? 'female' : 'male') || 'male',
      dob: new Date(card?.dob || new Date()),
      phoneNum: card?.phoneNum || '',
      email: card?.email || '',
      address: card?.address || '',
      city: card?.city || '',
      state: card?.state || '',
      zip: card?.zip || '',
      firstTime: card?.reasons.includes(Reasons.firstTime) || false,
      followJesus: card?.reasons.includes(Reasons.followJesus) || false,
      baptism: card?.reasons.includes(Reasons.baptism) || false,
      membership: card?.reasons.includes(Reasons.membership) || false,
      discipleship: card?.reasons.includes(Reasons.discipleship) || false,
      serve: card?.reasons.includes(Reasons.serve) || false,
      joinGroup: card?.reasons.includes(Reasons.joinGroup) || false,
      prayerRequests: card?.prayerRequests || '',
      confidential: card?.confidential || false,
      host: card?.whoHelped || '',
      otherHost: card?.otherHelp || '',
    },
  });

  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>(
    [],
  );

  useEffect(() => {
    fetch('/api/personnel/active?include_admin=true').then((res) => {
      res.json().then((json) => {
        const data: any[] = [];

        json.forEach((leader: Personnel) => {
          data.push({
            value: leader.id,
            label: `${leader.firstName} ${leader.lastName}`,
          });
        });
        data.push({ value: 'other', label: 'Other' });

        setLeaders(data);
      });
    });
    form.reset();
  }, []);

  const sleep = (ms: number) =>
    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve) => setTimeout(resolve, ms));

  const submitCard = (values: any) => {
    const checks: Reasons[] = [];
    if (values.firstTime) checks.push(Reasons.firstTime);
    if (values.followJesus) checks.push(Reasons.followJesus);
    if (values.baptism) checks.push(Reasons.baptism);
    if (values.membership) checks.push(Reasons.membership);
    if (values.discipleship) checks.push(Reasons.discipleship);
    if (values.serve) checks.push(Reasons.serve);
    if (values.joinGroup) checks.push(Reasons.joinGroup);

    const newCard: NextStepsCard = {
      name: values.name,
      gender: values.gender === 'male' ? 0 : 1,
      dob: values.dob,
      phoneNum: values.phoneNum,
      email: values.email,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      reasons: checks,
      prayerRequests: values.prayerRequests,
      confidential: values.confidential,
      whoHelped: values.host,
      otherHelp: values.otherHelp,
      date: card?.date ? new Date(card.date) : new Date(),
      completed: card?.completed || false,
    };
    if (isEdit) {
      fetch(`/api/cards/${card?.id}`, {
        method: 'PUT',
        body: JSON.stringify(newCard),
      }).then(() => onSubmit());
    } else {
      fetch('/api/cards', {
        method: 'POST',
        body: JSON.stringify(newCard),
      }).then(() => onSubmit());
    }
  };

  return (
    <>
      <Box>
        <form onSubmit={form.onSubmit(submitCard)}>
          <Group direction="column" spacing="sm" grow>
            <TextInput
              style={{ flexGrow: 1 }}
              required
              label="Name"
              placeholder="John Doe"
              {...form.getInputProps('name')}
            />
            <SegmentedControl
              data={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              {...form.getInputProps('gender')}
            />
            <DatePicker
              required
              placeholder="Pick date"
              label="Date of Birth"
              {...form.getInputProps('dob')}
            />
            <TextInput
              required
              label="Phone"
              placeholder="(816) 555-5555"
              {...form.getInputProps('phoneNum')}
            />
            <TextInput
              required
              label="Email"
              placeholder="john.doe@example.com"
              {...form.getInputProps('email')}
            />
            <TextInput
              required
              label="Address"
              placeholder="123 Place Ave."
              {...form.getInputProps('address')}
            />
            <TextInput
              required
              label="City"
              placeholder="Kansas City"
              {...form.getInputProps('city')}
            />
            <Select
              required
              data={States}
              label="State"
              {...form.getInputProps('state')}
            />
            <TextInput
              required
              label="Zip Code"
              placeholder="12345"
              {...form.getInputProps('zip')}
            />
            <Text size="sm">Check all that apply:</Text>
            <SimpleGrid cols={2}>
              <Checkbox
                label={REASON_DISPLAY_RECORD[Reasons.firstTime]}
                {...form.getInputProps('firstTime', { type: 'checkbox' })}
              />
              <Checkbox
                label={REASON_DISPLAY_RECORD[Reasons.followJesus]}
                {...form.getInputProps('followJesus', { type: 'checkbox' })}
              />
              <Checkbox
                label={REASON_DISPLAY_RECORD[Reasons.baptism]}
                {...form.getInputProps('baptism', { type: 'checkbox' })}
              />
              <Checkbox
                label={REASON_DISPLAY_RECORD[Reasons.membership]}
                {...form.getInputProps('membership', { type: 'checkbox' })}
              />
              <Checkbox
                label={REASON_DISPLAY_RECORD[Reasons.discipleship]}
                {...form.getInputProps('discipleship', { type: 'checkbox' })}
              />
              <Checkbox
                label={REASON_DISPLAY_RECORD[Reasons.serve]}
                {...form.getInputProps('serve', { type: 'checkbox' })}
              />
              <Checkbox
                label={REASON_DISPLAY_RECORD[Reasons.joinGroup]}
                {...form.getInputProps('joinGroup', { type: 'checkbox' })}
              />
            </SimpleGrid>
            <Select
              data={leaders}
              label="Who hosted you tonight?"
              required
              {...form.getInputProps('host')}
            />
            {form.values.host === 'other' && (
              <TextInput
                placeholder="John Doe"
                required={form.values.host === 'other'}
                {...form.getInputProps('otherHost')}
              />
            )}
            <Textarea
              rows={3}
              label="Prayer Requests"
              {...form.getInputProps('prayerRequests')}
            />
            <Checkbox
              label="Confidential"
              {...form.getInputProps('confidential')}
            />
            <Group position="right">
              <Button type="submit">Submit</Button>
            </Group>
          </Group>
        </form>
      </Box>
    </>
  );
}
