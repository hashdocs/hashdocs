'use client';
import { OrgType } from '@/types';
import { useParams } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { getOrg } from './org.actions';

interface OrgContext {
  org: OrgType;
}

export const OrgContext = createContext<OrgContext>(null!);

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const [org, setOrg] = useState<OrgType>(null!);

  const { org_id } = useParams();

  useEffect(() => {
    if (org_id) {
      const fetchOrg = async () => {
        const { org } = await getOrg();

        const current_org = org.find((org) => org.org_id === org_id);

        if (current_org) {
          setOrg(current_org);
        }
      };

      fetchOrg();
    }
  }, [org_id]);

  const value = useMemo(
    () => ({
      org,
    }),
    [org]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export default function useOrg() {
  const org = useContext(OrgContext);

  return org;
}
