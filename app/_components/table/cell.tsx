import clsx from 'clsx';
import React from 'react';

type TableCellProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <td
      className={clsx(
        'text-left p-2 align-middle',
        className
      )}
      onClick={onClick}
    >
      {children}
    </td>
  );
};

export default TableCell;
