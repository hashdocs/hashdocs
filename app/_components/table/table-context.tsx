import { createContext, useContext } from 'react';
import { TableProps } from './table.types';

interface AdditionalContextProps {
  allSelected: boolean;
  setAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export type TableContextType = Omit<
  TableProps,
  'children' | 'className' | 'wrapperClassName' | 'enablePagination'
> &
  AdditionalContextProps;

const TableContext = createContext<TableContextType>(null!);

export function useTableContext(): TableContextType {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error('ERR: Context not defined');
  }

  return context;
}

export default TableContext;
