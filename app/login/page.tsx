/* global google */
'use client';
import Navbar from '@/app/(marketing)/_components/navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../_components/button';
import Input from '../_components/input';
import { createClientComponentClient } from '../_utils/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [isSentMagicLink, setIsSentMagicLink] = useState(false);

  const handleSignIn = async () => {
    const loginPromise = new Promise(async (resolve, reject) => {

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
      loading: 'Authorizing...',
      success: (data: any) => `We've sent a magic link to ${data}`,
      error: 'Authorization failed! Please try again',
    });
  };

  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      //@ts-ignore
      window.google?.accounts?.id.initialize({
        client_id:
          '274576635618-0s6ola782ltn4idc3toi3tu622j1ulbr.apps.googleusercontent.com',
        callback: handleSignInWithGoogle,
        context: 'signin',
        ux_mode: 'popup',
        itp_support: true,
      });
      //@ts-ignore
      window.google?.accounts?.id.renderButton(divRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        shape: 'square',
        width: 320,
        logo_alignment: 'center',
      });
    }
  }, []);

  async function handleSignInWithGoogle(response: any) {
    const loginPromise = new Promise(async (resolve, reject) => {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        console.error(error);
        reject(false);
        return;
      }

      if (data.user) {
        resolve(true);
        router.push('/documents');
        router.refresh();
      }
    });

    toast.promise(loginPromise, {
      loading: 'Authorizing...',
      success: 'Signed in successfully!',
      error:
        "Sign in failed! If you've signed in directly with your email previously, please try that",
    });
  }

  return (
    <>
      <section className="flex h-screen w-full flex-1 flex-col items-start overflow-y-scroll bg-gray-50">
        <Navbar />
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center px-4">
          <div className="flex h-[400px] w-full max-w-sm flex-col justify-center gap-y-4 rounded-lg bg-white p-8 text-center font-semibold leading-6 tracking-wide shadow-lg">
            <p className="uppercase">{'Welcome to hashdocs'}</p>
            {isSentMagicLink ? (
              <p className="font-normal">
                Thank you!
                <br />
                <br />
                We&apos;ve sent a magic link for verification to{' '}
                <span className="font-bold">
                  <br />
                  {email}
                  <br />
                </span>
              </p>
            ) : (
              <>
                <div ref={divRef} className="h-10"></div>
                <div className="flex items-center justify-center py-2">
                  <div className="border-shade-line mr-2 flex-grow border-t"></div>
                  <span className="bg-white px-2">{'or'}</span>
                  <div className="border-shade-line ml-2 flex-grow border-t"></div>
                </div>
                <Input
                  inputProps={{
                    name: 'email',
                    onChange: (e) => setEmail(e.target.value),
                    value: email,
                    placeholder: 'Enter your official email',
                  }}
                  className="w-full rounded-md text-center text-sm placeholder:font-normal"
                />
                <Button
                  variant="solid"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSignIn()}
                >
                  {'Continue with email'}
                </Button>
                <p className="text-shade-pencil-light px-2 text-center text-xs font-normal tracking-tight">
                  By continuing, you explicitly agree to Hashdocs&apos; <br />
                  <Link href={`/terms`} className="underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href={`/privacy`} className="underline">
                    Privacy Policy
                  </Link>{' '}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
