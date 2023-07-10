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
  org,
}: {
  children: React.ReactNode;
  user: User;
  org: OrgType | null;
}) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.identify(user.id, user);
  }, []);

  return (
    <UserContext.Provider value={{ user, org }}>
      {children}
    </UserContext.Provider>
  );
}
