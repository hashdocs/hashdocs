"use client";
import { DocumentType } from "@/types/documents.types";
import { createContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  Session,
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { usePostHog } from "posthog-js/react";

export const UserContext = createContext<User | null>(null);

async function getUser(): Promise<User> {
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  return user;
}

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const posthog = usePostHog();

  useEffect(() => {
    getUser()
      .then((user) => {
        setUser(user);
        posthog.identify(user.id, user);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
