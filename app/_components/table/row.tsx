import clsx from 'clsx';
import React from 'react';
import If from '../if';
import { useTableContext } from './table-context';

type TableRowProps = {
  id: string;
  children?: React.ReactNode | Array<React.ReactNode>;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  checkboxClassName?: string;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
};

const TableRow: React.FC<TableRowProps> = ({
  id,
  children,
  className,
  onClick,
  onContextMenu,
}) => {
  const { rowSelection, enableRowSelection, setRowSelection } =
    useTableContext();

  const handleRowSelection = () => {
    if (setRowSelection) {
      // If the checkbox is checked, add the id to the rowSelection array. Else remove the id from the array
      setRowSelection((prev) => {
        if (!rowSelection?.includes(id)) {
          return [...prev, id];
        } else {
          return prev.filter((rowId) => rowId !== id);
        }
      });
    }
  };

  return (
    <tr
      className={clsx('rounded border-b border-white', className)}
      onClick={onClick}
      onContextMenu={onContextMenu}
      data-testid={`table-row-${id}`}
    >
      <If
        _condition={!!enableRowSelection}
        _then={
          <td
            className="cursor-pointer p-2 align-middle"
            onClick={handleRowSelection}
          >
            <input
              checked={Array.isArray(rowSelection) && rowSelection.includes(id)}
              type="checkbox"
              name={id}
              className={clsx(
                'h-3 w-3 cursor-pointer rounded-sm border border-gray-300 text-blue-700'
              )}
              value={rowSelection?.includes(id) ? 'true' : 'false'}
              data-testid={`table-checkbox-${id}`}
              onChange={() => {}}
            />
          </td>
        }
      />
      {children}
    </tr>
  );
};

export default TableRow;
