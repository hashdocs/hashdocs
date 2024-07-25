'use client';
import { createClientComponentClient } from '@/app/_utils/supabase';
import { OrgType } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createOrg, getOrg } from './org.actions';
import { useUser } from './useUser';

interface OrgContext {
  org: OrgType | undefined;
  revalidateOrg: () => Promise<void>;
  orgData: OrgType[] | undefined;
  handleCreateOrg: () => Promise<void>;
}

export const OrgContext = createContext<OrgContext>(null!);

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const [orgData, setOrgData] = useState<OrgType[]>();

  const params = useParams();
  const router = useRouter();
  const { handleLogout, handleRefreshSession } = useUser();

  // LOAD ORGS

  useEffect(
    () => {
      revalidateOrg();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const org = useMemo(
    () => orgData?.find((o) => o.org_id == params.org_id),
    [orgData, params]
  );

  // CREATE ORG

  const handleCreateOrg = async (with_toast = true) => {
    const createOrgPromise = new Promise(async (resolve, reject) => {
      const supabase = createClientComponentClient();
      try {
        if (
          orgData &&
          orgData.length > 0 &&
          orgData.find((o) => o.org_plan == 'Free')
        ) {
          throw new Error(
            'Only one org is allowed on the free plan. Please upgrade to create additional organizations'
          );
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('User not found');
        }

        const new_org = await createOrg({ user });
        revalidateOrg();
        resolve(new_org);
      } catch (error) {
        reject(error);
      }
    });

    with_toast
      ? await toast.promise(createOrgPromise, {
          loading: 'Creating org...',
          success: 'Org created successfully',
          error: (error) => error?.message ?? 'Failed to create org',
        })
      : await createOrgPromise.then(() => {}).catch(() => {});
  };

  const revalidateOrg = async () => {
    await handleRefreshSession();
    let _org = await getOrg();

    if (_org.length === 0) {
      await handleCreateOrg(false);
      _org = await getOrg();
    }

    setOrgData(_org);

    if (_org.length == 1) {
      router.push(`/dashboard/${_org[0].org_id}/documents`);
    }
  };

  const value = useMemo(
    () => ({
      org,
      revalidateOrg,
      handleCreateOrg,
      orgData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [org, orgData]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export default function useOrg() {
  const org = useContext(OrgContext);

  return org;
}
