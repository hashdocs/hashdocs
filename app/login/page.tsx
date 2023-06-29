/* global google */
"use client";
import Navbar from "@/app/(marketing)/_components/navbar";
import { Database } from "@/types/supabase.types";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Script from "next/script";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const [isSentMagicLink, setIsSentMagicLink] = useState(false);

  const searchParams = useSearchParams();

  const new_user = searchParams.get("new_user");

  const handleSignIn = async (e: any) => {
    console.log(`email - ${email}`);
    const loginPromise = new Promise(async (resolve, reject) => {
      e.preventDefault();

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login/callback`,
        },
      });

      if (error) {
        console.error(error);
        reject(false);
      } else {
        setIsSentMagicLink(true);
        resolve(email);
      }
    });

    toast.promise(loginPromise, {
      loading: "Authorizing...",
      success: (data: any) => `We've sent a magic link to ${data}`,
      error: "Authorization failed! Please try again",
    });
  };

  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      //@ts-ignore
      window.google?.accounts?.id.initialize({
        client_id:
          "274576635618-0s6ola782ltn4idc3toi3tu622j1ulbr.apps.googleusercontent.com",
        callback: handleSignInWithGoogle,
        context: "signin",
        ux_mode: "popup",
        itp_support: true,
      });
      //@ts-ignore
      window.google?.accounts?.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        text: "continue_with",
        shape: "square",
        width: "320",
        logo_alignment: "center",
      });
    }
  }, []);

  async function handleSignInWithGoogle(response: any) {
    console.log(response.credential);
    const loginPromise = new Promise(async (resolve, reject) => {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });

      if (error) {
        reject(false);
      }

      if (data) {
        resolve(true);
        router.push("/documents");
      }
    });

    toast.promise(loginPromise, {
      loading: "Authorizing...",
      success: "Signed in successfully!",
      error: "Sign in failed! Please try again",
    });
  }

  return (
    <section className="flex h-screen w-full flex-1 flex-col items-start">
      <Navbar />

      <div className="flex h-full w-full flex-1 flex-col items-center justify-center px-4">
        <form
          onSubmit={handleSignIn}
          className="flex h-2/5 w-full max-w-sm flex-col justify-center gap-y-4 rounded-lg bg-white p-8 text-center font-semibold leading-6 tracking-wide text-shade-pencil-dark shadow-lg"
        >
          {isSentMagicLink ? (
            <p className="font-normal">
              Thank you!
              <br />
              <br />
              We&apos;ve sent a magic link for verification to{" "}
              <span className="font-bold">
                <br />
                {email}
                <br />
              </span>
            </p>
          ) : (
            <>
              <p className="uppercase">
                {new_user === "true"
                  ? "Create your free account"
                  : "Login to your account"}
              </p>

              {/* <div className="relative h-12 w-80 rounded-lg bg-white cursor-pointer  border-shade-line border">
              <div ref={divRef} className="absolute inset-1 z-10"></div>
              <div className="absolute inset-0 rounded-lg bg-white w-full h-full flex items-center justify-center z-20">Continue with google</div>
            </div> */}

              <div ref={divRef} className="h-10"></div>

              <div className="flex items-center justify-center py-2">
                <div className="mr-2 flex-grow border-t border-shade-line"></div>
                <span className="bg-white px-2">{"or"}</span>
                <div className="ml-2 flex-grow border-t border-shade-line"></div>
              </div>
              <input
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="h-10 rounded-md border border-shade-line bg-shade-overlay/50 px-2 py-3 text-sm shadow-inner focus:border-stratos-default focus:ring-0 focus:ring-stratos-default"
                placeholder="Email"
              />
              <button
                type="submit"
                className="bg-stratos-gradient h-10 rounded-md border border-stratos-default text-white hover:bg-stratos-default/80"
              >
                {new_user === "true" ? "Sign up" : "Sign in"}
              </button>
              <p className="px-2 text-center text-xs font-normal tracking-tight text-shade-pencil-light">
                By continuing, you agree to Hashdocs&apos;{" "}
                <Link href={`/terms`} className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href={`/privacy`} className="underline">
                  Privacy Policy
                </Link>{" "}
                and to receive periodic email communications
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}