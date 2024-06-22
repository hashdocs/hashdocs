import { OrgType } from '@/types';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import OrgThumb from '../_components/orgThumb';
import { createOrg, getOrg } from './[org_id]/_provider/org.actions';

export default async function Page() {
  const { org, user } = await getOrg();

  let default_org: OrgType | undefined;

  if (!user || !user.email) {
    redirect('/login');
  }

  if (org.length == 1) {
    default_org = org[0];
  } else if (org.length == 0) {
    const new_org = await createOrg({ user });
    default_org = new_org;
  } else if (getCookie('hashdocs_active_org_id')) {
    default_org = org.find(
      (o) => o.org_id === getCookie('hashdocs_active_org_id')
    );
  }

  if (default_org) redirect(`/dashboard/${default_org.org_id}/documents`);

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-600">Your Organizations</h1>
      </div>
      {org.map((o) => (
        <Link
          key={o.org_id}
          className="flex w-fit items-center gap-x-4 rounded-lg bg-white p-8 shadow hover:bg-blue-50/50"
          href={`/dashboard/${o.org_id}/documents`}
        >
          <OrgThumb org={o} className="h-12 w-12" />
          <div className="flex flex-col gap-y-1">
            <h2 className="text-lg font-semibold">{o.org_name}</h2>
            <p className="text-gray-400">{o.org_id}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
