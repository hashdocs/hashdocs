'use client';
import Dropdown from '@/app/_components/dropdown';
import OrgThumb from '@/app/_components/orgThumb';
import { OrgType } from '@/types';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { MdCheck } from 'react-icons/md';

export const OrgDropdown: React.FC<{ org: OrgType[] }> = ({ org }) => {
  const { org_id } = useParams() as { org_id: string };

  return (
    <Dropdown
      items={org.map((o) => ({
        element: <OrgSelectorItem o={o} checked={o.org_id == org_id} />,
      }))}
    >
      <OrgSelectorItem o={org.find((o) => o.org_id == org_id) ?? null} />
    </Dropdown>
  );
};

export const OrgSelectorItem: React.FC<{
  o: OrgType | null;
  checked?: boolean;
}> = ({ o, checked }) => {
  return (
    <div
      key={o?.org_id ?? 'default'}
      // onClick={item.optionClick}
      className={clsx(
        'flex w-48 items-center justify-between gap-x-1 truncate border-0 !py-2.5 no-underline shadow-none'
      )}
    >
      <div className="flex flex-1 items-center gap-x-2">
        {o && <OrgThumb org={o} className="h-4 w-4" />}
        <p className={clsx(checked ? 'font-semibold ' : 'text-gray-500')}>
          {o?.org_name || 'Select org'}
        </p>
      </div>
      <MdCheck
        className={clsx(
          checked ? 'font-semibold text-blue-700' : 'opacity-0',
          'shrink-0'
        )}
      />
    </div>
  );
};
