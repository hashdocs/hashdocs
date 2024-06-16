'use client';
import { createClientComponentClient } from '@/app/_utils/supabase';
import { OrgType } from '@/types';
import { useRouter } from 'next/navigation';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { getOrg } from './org.actions';

interface OrgContext {
  org: OrgType;
  orgData: OrgType[];
  handleLogout: () => void;
}

export const OrgContext = createContext<OrgContext>(null!);

export const OrgProvider = ({
  children,
  org_data,
}: {
  children: React.ReactNode;
  org_data: OrgType[];
}) => {
  const [orgData, setOrgData] = useState(org_data);

  const supabase = createClientComponentClient();
  const [activeOrgId, setActiveOrgId] = useState<string>();
  const router = useRouter();

  const org = useMemo(() => {
    return orgData.find((org) => org.org_id === activeOrgId) || orgData[0];
  }, [orgData, activeOrgId]);

  /* -------------------------------------------------------------------------- */
  /*                                HANDLE LOGOUT                               */
  /* -------------------------------------------------------------------------- */

  const handleLogout = useCallback(async () => {
    const logoutPromise = new Promise(async (resolve, reject) => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });

    await toast.promise(logoutPromise, {
      loading: 'Logging out...',
      success: 'Logged out successfully',
      error: 'Failed to logout',
    });
    setActiveOrgId(undefined);
    router.push('/login');
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               REVALIDATE ORG                               */
  /* -------------------------------------------------------------------------- */

  const revalidateOrg = useCallback(async () => {
    const _org = await getOrg();

    setOrgData(_org);
  }, []);

  //! UseEffect for auth realtime
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      switch (event) {
        case 'SIGNED_IN': {
          revalidateOrg();
          break;
        }

        case 'SIGNED_OUT': {
          break;
        }

        default:
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             DEXIE ERROR HANDLER                            */
  /* -------------------------------------------------------------------------- */

  const value = useMemo(
    () => ({
      org,
      orgData,
      handleLogout,
    }),
    [org, orgData]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export default function useOrg() {
  const org = useContext(OrgContext);

  return org;
}
