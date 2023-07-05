"use client";
import { createContext, useEffect } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { usePostHog } from "posthog-js/react";

export const UserContext = createContext<User | null>(null);

export default function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.identify(user.id, user);
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
