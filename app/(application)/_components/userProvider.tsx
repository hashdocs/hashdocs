"use client";
import { DocumentType } from "@/types/documents.types";
import { createContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  Session,
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

export const SessionContext = createContext<Session | null>(null);

async function getSession(): Promise<Session> {
  const supabase = createClientComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/')
  }

  return session;
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    getSession()
      .then((session) => {
        setSession(session);
      })
      .catch((err) => {
        console.error(err);
        router.replace("/login");
      });
  }, []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
