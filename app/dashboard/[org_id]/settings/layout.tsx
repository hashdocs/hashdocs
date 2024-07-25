'use client';
import Button from '@/app/_components/button';
import useOrg from '../_provider/useOrg';
import { useUser } from '../_provider/useUser';
/*=========================================== COMPONENT ===========================================*/

import { useRouter } from 'next/navigation';
import SettingsSidebar from './_components/settingsSidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { org } = useOrg();
  const { user } = useUser();
  const router = useRouter();

  const role = org?.members.find((m) => m.email == user?.email)?.role;

  if (!role || role == 'member') {
    return (
      <div className="flex h-screen w-full flex-1 flex-col items-center justify-center gap-y-4 px-4 text-center">
        <h1 className="text-6xl font-black text-gray-200">Restricted</h1>

        <p className="">Settings are restricted to admins only!</p>

        <Button variant="solid" size="md" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1">
      <SettingsSidebar />
      <div className="flex flex-1 flex-col gap-y-2">
        {/* <PageHeader /> */}
        {children}
      </div>
    </div>
  );
}
