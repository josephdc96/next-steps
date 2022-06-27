import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Group,
  ScrollArea,
  SegmentedControl,
  Stack,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useState } from 'react';
import type { FilterValues } from '#/types/new-here';
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
      <ScrollArea style={{ height: 400 }}>
        <CheckboxGroup
          label="Hosts"
          value={hostFilter}
          orientation="vertical"
          onChange={(value) => setHostFilter(value)}
        >
          {leaders.map((leader) => (
            <Checkbox
              key={`chk_${leader.value}`}
              label={leader.label}
              value={leader.value}
            />
          ))}
        </CheckboxGroup>
      </ScrollArea>
      <Divider />
      <CheckboxGroup
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
      </CheckboxGroup>
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
