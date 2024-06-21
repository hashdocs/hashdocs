'use client';

import { Switch as HeadlessSwitch } from '@headlessui/react';
import React from 'react';

type SwitchProps = {
  className?: string;
  disabled?: boolean;
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  callback?: (checked: boolean) => void;
};

const Switch: React.FC<SwitchProps> = ({
  className = '',
  enabled,
  setEnabled,
  callback,
  disabled
}) => {
  return (
    <HeadlessSwitch
      checked={enabled}
      disabled={disabled}
      onChange={(checked) => {
        setEnabled(checked);
        callback && callback(checked);
      }}
      className={`${
        enabled && !disabled ? '!bg-blue-700' : '!bg-gray-400'
      } relative inline-flex h-6 w-11 items-center rounded-full ${className}`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </HeadlessSwitch>
  );
};

export default Switch;
