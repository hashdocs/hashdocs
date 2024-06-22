'use client';
import useOrg from '../../_provider/useOrg';
import { InviteTeamButton } from './_components/inviteTeam';
import { MemberRow } from './_components/memberRow';

export default function Page({
  params: { org_id },
}: {
  params: { org_id: string };
}) {
  const { org } = useOrg();

  return (
    <>
      <section className="flex h-full w-full flex-col items-center">
        <div className="w-full max-w-2xl space-y-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-600">Team</h1>
              <p className="text-sm text-gray-400">
                Manage who has access to this workspace
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <InviteTeamButton />
            </div>
          </div>
          <hr />
          <div className="grid">
            {org?.members.map((member, idx) => (
              <MemberRow key={idx} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
