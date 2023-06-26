"use client";
import Navbar from "@/app/(marketing)/_components/navbar";
import { Database } from "@/types/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const searchParams = useSearchParams();

  const new_user = searchParams.get("new_user");

  const handleSignIn = async (e: any) => {
    const loginPromise = new Promise(async (resolve, reject) => {
      e.preventDefault();

      const {
        data: { user },
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!user) {
        reject(false);
      } else {
        resolve(true);
        router.push("/documents");
      }
    });

    toast.promise(loginPromise, {
      loading: "Authorizing...",
      success: "Signed in successfully!",
      error: "Sign in failed! Please try again",
    });
  };

  return (
    <section className="flex h-screen w-full flex-1 flex-col items-start">
      <Navbar />
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center px-4">
        <form
          onSubmit={handleSignIn}
          className="flex w-full max-w-lg flex-col justify-center rounded-lg bg-white p-8 font-semibold leading-6 tracking-wide text-shade-pencil-dark shadow-lg"
        >
          <p className="mb-4 uppercase">
            {new_user === "true"
              ? "Create your free account"
              : "Login to your account"}
          </p>
          <input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="my-1 rounded-md border border-shade-line bg-shade-overlay/50 px-2 py-3 text-sm shadow-inner focus:border-stratos-default focus:ring-stratos-default"
            placeholder="Email"
          />
          <p className="mb-4 text-right text-xs font-normal text-shade-pencil-light">
            {!new_user && (
              <Link href={`/terms`} className="underline">
                Login with an one-time link
              </Link>
            )}
          </p>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="my-1 rounded-md border border-shade-line bg-shade-overlay/50 px-2 py-3 text-sm shadow-inner focus:border-stratos-default focus:ring-stratos-default"
            placeholder="Password"
          />
          <p className="mb-4 text-right text-xs font-normal text-shade-pencil-light">
            {!new_user && (
              <Link href={`/terms`} className="underline">
                Forgot password
              </Link>
            )}
          </p>
          <button
            type="submit"
            className="bg-stratos-gradient my-3 rounded-md border border-stratos-default px-2 py-3 text-white"
          >
            {new_user === "true" ? "Sign up" : "Sign in"}
          </button>
          <p className="px-2 pt-4 text-center text-xs font-normal tracking-tight text-shade-pencil-light">
            By continuing, you agree to hashdocs'{" "}
            <Link href={`/terms`} className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href={`/privacy`} className="underline">
              Privacy Policy
            </Link>{" "}
            and to receive periodic email communications
          </p>
        </form>
      </div>
    </section>
  );
}
