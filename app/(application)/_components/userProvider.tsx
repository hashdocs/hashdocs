"use client";
import { DocumentType } from "@/types/documents.types";
import { createContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  Session,
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import PostHogClient from "@/app/_lib/postHogClient";

export const UserContext = createContext<User | null>(null);

async function getUser(): Promise<User> {
  const supabase = createClientComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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
  const posthog = PostHogClient();

  useEffect(() => {
    getUser()
      .then((user) => {
        setUser(user);
        posthog.identify({ distinctId: user.id, properties: user });
      })
      .catch((err) => {
        console.error(err);
        router.replace("/login");
      });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
