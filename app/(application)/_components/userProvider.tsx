"use client";
import { createContext, useEffect, useState } from "react";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { usePostHog } from "posthog-js/react";
import { OrgType, UserContextType } from "@/types/settings.types";
import { Database } from "@/types/supabase.types";

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const posthog = usePostHog();
  const supabase = createClientComponentClient<Database>();
  const [org, setOrg] = useState<OrgType | null>(null);

  useEffect(() => {
    async function getOrg() {
      posthog.identify(user.id, user);
      const { data: org } = await supabase
        .rpc("get_org")
        .returns<OrgType[]>()
        .maybeSingle();

      if (org) {
        setOrg(org);
      }
    }
    getOrg();
  }, []);

  return (
    <UserContext.Provider value={{user, org}} >{children}</UserContext.Provider>
  );
}
