import React from 'react';
import SelectField from './SelectField';
import { daysAgoISO, dateLabel } from '../utils/format';

// Pick a date from the last 2 weeks (lost/found dates are always recent).
// value is a 'YYYY-MM-DD' string.
export default function DateField({ label, value, onChange, error }) {
  const options = Array.from({ length: 14 }, (_, i) => {
    const iso = daysAgoISO(i);
    return { value: iso, label: dateLabel(iso) };
  });
  return (
    <SelectField
      label={label}
      icon="calendar-outline"
      value={value}
      options={options}
      onSelect={onChange}
      error={error}
      title="Choose a date"
    />
  );
}
