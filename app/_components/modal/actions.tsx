import clsx from 'clsx';
import React from 'react';
import Button, { ButtonProps } from '../button';

const Actions: React.FC<{
  cancel?: {
    label: React.ReactNode;
    props: ButtonProps['buttonProps'];
    className?: string;
  };
  confirm?: {
    label: React.ReactNode;
    props: ButtonProps['buttonProps'];
    className?: string;
  };
}> = ({ cancel, confirm }) => {
  return (
    <div className="mt-4 flex justify-end gap-x-2">
      {cancel ? (
        <Button
          size="sm"
          variant="outline"
          className={clsx(cancel.className)}
          buttonProps={cancel.props}
        >
          {cancel.label || 'Cancel'}
        </Button>
      ) : null}
      {confirm ? (
        <Button
          size="sm"
          variant="solid"
          className={clsx(confirm.className, 'hover:!bg-opacity-80')}
          buttonProps={confirm.props}
        >
          {confirm.label || 'Confirm'}
        </Button>
      ) : null}
    </div>
  );
};

export default Actions;
