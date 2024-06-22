import Input from '@/app/_components/input';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CgClose, CgSearch } from 'react-icons/cg';

type SearchInputProps = {
  reset: (e: React.MouseEvent<HTMLElement>) => void;
  query: string | null;
  setQuery:
    | React.Dispatch<React.SetStateAction<string | null>>
    | ((q: string) => void);
  wrapperClassName?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  reset,
  query,
  setQuery,
  wrapperClassName,
}) => {
  const router = useRouter();

  return (
    <Input
      inputProps={{
        placeholder: 'Search',
        name: 'search',
        onChange: (e) => setQuery(e.target.value),
        value: query || '',
      }}
      size="sm"
      wrapperClassName={wrapperClassName}
      className="px-6 placeholder:text-gray-400 focus:border-blue-700 focus:ring-blue-700"
      prefix={
        <figure className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400">
          <CgSearch />
        </figure>
      }
      suffix={
        <figure
          role="button"
          className={clsx(
            'absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400',
            !!query ? 'block' : 'hidden'
          )}
          onClick={(e) => {
            setQuery('');
            reset(e);
          }}
        >
          <CgClose />
        </figure>
      }
    />
  );
};

export default SearchInput;
