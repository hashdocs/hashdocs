'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';
import Button from '../_components/button';
import OrgThumb from '../_components/orgThumb';
import Loading from '../loading';
import useOrg from './[org_id]/_provider/useOrg';

export default function Page() {
  const { orgData, handleCreateOrg } = useOrg();

  return !orgData ? (
    <Loading />
  ) : (
    <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-600">Your Organizations</h1>
        <Button
          key={'new-org'}
          onClick={() => handleCreateOrg()}
          variant="solid"
          className={clsx(
            'flex items-center justify-between gap-x-1 truncate border-0 !py-2.5 no-underline shadow-none'
          )}
        >
          <div className="flex flex-1 items-center gap-x-2">
            <MdAdd className={clsx('shrink-0')} />
            <p className={clsx('')}>{`Create org`}</p>
          </div>
        </Button>
      </div>
      {orgData.length == 0 ? (
        <Button
          variant="white"
          className="flex w-96 h-32 items-center gap-x-4 rounded-lg bg-white p-8 shadow hover:bg-blue-50/50"
          onClick={() => handleCreateOrg()}
        >
          <MdAdd className="h-12 w-12 rounded-md" />
          <div className="flex flex-col text-left gap-y-1">
            <h2 className="text-lg font-semibold">{`Create new org`}</h2>
            <p className="text-xs text-gray-400">{`Each org is a separate workspace to organize your datarooms and teams efficiently`}</p>
          </div>
        </Button>
      ) : (
        orgData.map((o) => (
          <Link
            key={o.org_id}
            className="flex w-96 h-32 items-center gap-x-4 rounded-lg bg-white p-8 shadow hover:bg-blue-50/50"
            href={`/dashboard/${o.org_id}/documents`}
          >
            <OrgThumb org={o} className="h-12 w-12 rounded-md" />
            <div className="flex flex-col gap-y-1">
              <h2 className="text-lg font-semibold">{o.org_name}</h2>
              <p className="text-xs text-gray-400">{o.org_id}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
