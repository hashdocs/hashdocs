import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import If from '../if';
import { useTableContext } from './table-context';

type TableHeaderProps = {
  children: Array<React.ReactNode> | React.ReactNode;
  className?: string;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  const {
    allSelected,
    setAllSelected,
    enableRowSelection,
    rowSelection,
    setRowSelection,
    data,
    indexId,
  } = useTableContext();

  const handleSelectAll: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!setRowSelection) return;
    setRowSelection(() => (e.target.checked ? data.map((g) => g[indexId]) : []));
    setAllSelected(e.target.checked);
  };
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      headerCheckboxRef.current &&
      rowSelection &&
      rowSelection.length > 0 &&
      rowSelection.length < data.length
    ) {
      headerCheckboxRef.current.indeterminate = true;
    }
  }, [rowSelection]);

  return (
    <tr
      className={clsx(
        'sticky top-0 z-10 border-b border-gray-100  bg-white shadow-sm',
        className
      )}
      data-testid="table-header"
    >
      <If
        _condition={!!enableRowSelection}
        _then={
          <td
            typeof="label"
            className="h-6 w-6 cursor-pointer p-2 align-middle"
          >
            <input
              type="checkbox"
              ref={headerCheckboxRef}
              checked={allSelected}
              id="checkbox"
              name="all"
              className={clsx(
                'h-3 w-3 cursor-pointer rounded-sm border border-gray-300 text-green-700 indeterminate:text-green-700 focus:border-gray-300 focus:ring-transparent'
              )}
              onChange={handleSelectAll}
              data-testid="table-all-checkbox"
            />
          </td>
        }
      />
      {children}
    </tr>
  );
};

export default TableHeader;
