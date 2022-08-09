import type { FilterValues } from '#/types/new-here';

import { useEffect, useState } from 'react';
import { string } from 'prop-types';
import { DatePicker } from '@mantine/dates';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  ScrollArea,
  SegmentedControl,
  Stack,
  TextInput,
  Text,
  ActionIcon,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { REASON_DISPLAY_RECORD, Reasons } from '#/types/new-here';

interface FilterPanelProps {
  values: FilterValues;
  leaders: { value: string; label: string }[];
  apply(values: FilterValues): void;
}

const REASONS_VALUES = [
  { value: 'firstTime', label: REASON_DISPLAY_RECORD[Reasons.firstTime] },
  { value: 'followJesus', label: REASON_DISPLAY_RECORD[Reasons.followJesus] },
  { value: 'baptism', label: REASON_DISPLAY_RECORD[Reasons.baptism] },
  { value: 'membership', label: REASON_DISPLAY_RECORD[Reasons.membership] },
  { value: 'discipleship', label: REASON_DISPLAY_RECORD[Reasons.discipleship] },
  { value: 'serve', label: REASON_DISPLAY_RECORD[Reasons.serve] },
  { value: 'joinGroup', label: REASON_DISPLAY_RECORD[Reasons.joinGroup] },
];

export const FilterPanel = ({ values, leaders, apply }: FilterPanelProps) => {
  const [boxesFilter, setBoxesFilter] = useState<string[]>(values.boxes);
  const [hostFilter, setHostFilter] = useState<string[]>(values.hosts);
  const [startDate, setStartDate] = useState(values.startDate);
  const [endDate, setEndDate] = useState(values.endDate);
  const [completed, setCompleted] = useState(values.completed);
  const [hostSearch, setHostSearch] = useState('');
  const [leaderList, setLeaderList] = useState(leaders);

  const searchHosts = (query: string) => {
    setHostSearch(query);
    if (query !== '') {
      setLeaderList(
        leaders.filter((x) =>
          x.label.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    } else {
      setLeaderList(leaders);
    }
  };

  useEffect(() => {
    setLeaderList(leaders);
  }, [leaders]);

  return (
    <Stack>
      {(values.boxes !== boxesFilter ||
        values.hosts !== hostFilter ||
        values.startDate !== startDate ||
        values.endDate !== endDate ||
        values.completed !== completed) && (
        <Group position="right">
          <Button
            variant="outline"
            onClick={() => {
              setBoxesFilter(values.boxes);
              setHostFilter(values.hosts);
              setStartDate(values.startDate);
              setEndDate(values.endDate);
              setCompleted(values.completed);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              apply({
                boxes: boxesFilter,
                hosts: hostFilter,
                startDate,
                endDate,
                completed,
              });
            }}
          >
            Apply
          </Button>
        </Group>
      )}
      <Text size="sm">Hosts</Text>
      <TextInput
        icon={<FontAwesomeIcon icon="search" />}
        size="xs"
        value={hostSearch}
        onChange={(x) => searchHosts(x.target.value)}
        rightSection={
          hostSearch !== '' && (
            <ActionIcon onClick={() => setHostSearch('')}>
              <FontAwesomeIcon icon="close" />
            </ActionIcon>
          )
        }
      />
      <ScrollArea style={{ height: 400 }}>
        <Checkbox.Group
          value={hostFilter}
          orientation="vertical"
          onChange={(value) => setHostFilter(value)}
        >
          {leaderList.map((leader) => (
            <Checkbox
              key={`chk_${leader.value}`}
              label={leader.label}
              value={leader.value}
            />
          ))}
        </Checkbox.Group>
        {leaderList.length === 0 && <Text>No Results</Text>}
      </ScrollArea>
      <Divider />
      <Checkbox.Group
        label="Reasons"
        value={boxesFilter}
        onChange={setBoxesFilter}
        orientation="vertical"
      >
        {REASONS_VALUES.map((reason) => (
          <Checkbox
            key={`chk_${reason.value}`}
            label={reason.label}
            value={reason.value}
          />
        ))}
      </Checkbox.Group>
      <Divider />
      <DatePicker
        value={startDate}
        onChange={(date) => setStartDate(date || new Date())}
        clearable={false}
        label="Start Date"
      />
      <DatePicker
        value={endDate}
        onChange={(date) => setEndDate(date || new Date())}
        clearable={false}
        label="End Date"
      />
      <Divider />
      <SegmentedControl
        data={[
          { value: 'complete', label: 'Completed' },
          { value: 'all', label: 'All' },
        ]}
        value={completed ? 'complete' : 'all'}
        onChange={(value) => {
          setCompleted(value === 'complete');
        }}
      />
    </Stack>
  );
};
