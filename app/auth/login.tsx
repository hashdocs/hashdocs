"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Database } from "@/types/supabase.types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!user) {
      return;
    }
    router.push("/documents");
  };

  return (
    <div className="flex flex-1 justify-center max-w-lg flex-col space-y-4">
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="rounded-md border border-shade-line px-2 py-3 text-sm"
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="rounded-md border border-shade-line px-2 py-3 text-sm"
        placeholder="Password"
      />
      <button
        onClick={handleSignIn}
        className="rounded-md border border-stratos-default bg-stratos-default px-2 py-3 text-white"
      >
        Sign in
      </button>
    </div>
  );
}
