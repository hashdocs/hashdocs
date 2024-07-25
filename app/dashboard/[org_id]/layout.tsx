'use client';
import { useRouter } from 'next/navigation';
import useOrg from './_provider/useOrg';

export default function Layout({
  params: { org_id },
  children,
}: {
  params: { org_id: string };
  children: React.ReactNode;
}) {
  const { orgData } = useOrg();
  const router = useRouter();

  if (orgData && !orgData.find((o) => o.org_id == org_id)) {
    router.push('/dashboard');
  }

  return <>{children}</>;
}
