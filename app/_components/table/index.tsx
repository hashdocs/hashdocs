'use client';

import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import If from '../if';
import Loader from '../loader';
import TableCell from './cell';
import TableHeader from './header';
import TableRow from './row';
import TableContext from './table-context';
import { TableProps } from './table.types';

const TableComponent = ({
  className,
  children,
  wrapperClassName,
  enablePagination,
  loading,
  disabled,
  currentPage = 0,
  ...props
}: TableProps) => {
  const [allSelected, setAllSelected] = React.useState<boolean>(false);

  const contextValue = { ...props, allSelected, setAllSelected };

  let header = null;
  let rows: any = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === TableHeader) {
        header = child;
      } else if (child.type === TableRow) {
        rows.push(child);
      }
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      left: 0,
    });
  }, [currentPage]);

  return (
    <TableContext.Provider value={contextValue}>
      <div
        ref={scrollRef}
        className={clsx(
          'relative flex-1 overflow-x-auto p-0',
          wrapperClassName,
          disabled && 'pointer-events-none'
        )}
      >
        <table
          className={clsx(
            'z-0 min-w-full table-fixed whitespace-nowrap',
            className
          )}
        >
          <thead>{header}</thead>
          <tbody className="max-h-full overflow-auto">{rows}</tbody>
        </table>
      </div>
      <If
        _condition={!!enablePagination}
        _then={
          <div
            className="no-select sticky bottom-0 left-0 flex w-full items-center gap-x-2 border-t px-2 py-2 text-xs shadow-sm"
            data-testid="table-pagination"
          >
            <span
              className={clsx(
                'cursor-pointer rounded border px-2 py-1 hover:bg-gray-100',
                [0, 1].includes(currentPage) &&
                  'pointer-events-none text-gray-400'
              )}
              onClick={() => {
                // setAllSelected(false);
                props?.setPage?.(currentPage - 1);
              }}
            >
              <BsArrowLeft className="text-xs" />
            </span>
            <span>
              {!!props.totalPages
                ? `${currentPage} of ${props.totalPages}`
                : `0 of 0`}
            </span>
            <span
              className={clsx(
                'cursor-pointer rounded border px-2 py-1 hover:bg-gray-100',
                currentPage === props.totalPages &&
                  'pointer-events-none text-gray-400'
              )}
              onClick={() => {
                // setAllSelected(false);
                props?.setPage?.(currentPage + 1);
              }}
            >
              <BsArrowRight className="text-xs" />
            </span>
            <span>
              {!!props.totalRows &&
                props.totalRows > 0 &&
                `${(currentPage - 1) * 100 + 1} to ${Math.min(
                  currentPage * 100,
                  props.totalRows
                )} of ${props.totalRows} rows`}
            </span>
            <If
              _condition={!!loading}
              _then={
                <figure className="text-gray-600">
                  <Loader />
                </figure>
              }
            />
            {!!props.rowSelection && props.rowSelection.length > 0 && (
              <span className="font-semibold text-green-700">
                <span className="pr-2">{`|`}</span>
                <span>{`${props.rowSelection.length} rows selected`}</span>
              </span>
            )}
          </div>
        }
      />
    </TableContext.Provider>
  );
};

TableComponent.displayName = 'Table';

const Table = Object.assign(TableComponent, {
  Header: TableHeader,
  Row: TableRow,
  Cell: TableCell,
});

export default Table;
