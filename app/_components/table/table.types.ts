export interface TableProps {
  loading?: boolean;
  indexId: string;
  data: Array<{ [key: string]: any }>
  children: Array<React.ReactNode> | React.ReactNode;
  wrapperClassName?: string;
  className?: string;
  rowSelection?: string[];
  setRowSelection?: React.Dispatch<React.SetStateAction<string[]>>;
  onRowSelectionChange?: (currVal: Array<string[]>) => void;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  totalRows?: number;
  totalPages?: number;
  rowsPerPage?: number;
  currentPage?: number;
  setPage?: (page: number) => void;
  disabled?: boolean
}