import Link from 'next/link';
import { redirect } from 'next/navigation';
import OrgThumb from '../_components/orgThumb';
import { createOrg, getOrg } from './[org_id]/_provider/org.actions';

export default async function Page() {
  const { org, user } = await getOrg();

  if (org.length == 0) {
    const new_org = await createOrg({ user: user });

    redirect(`/dashboard/${new_org.org_id}/documents`);
  }

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
          <OrgThumb org={o} className="h-12 w-12 rounded-md" />
          <div className="flex flex-col gap-y-1">
            <h2 className="text-lg font-semibold">{o.org_name}</h2>
            <p className="text-xs text-gray-400">{o.org_id}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
