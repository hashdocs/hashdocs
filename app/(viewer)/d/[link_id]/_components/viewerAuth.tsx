'use client';
import Button from '@/app/_components/button';
import Loader from '@/app/_components/loader';
import { LinkViewType } from '@/types';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { authorizeViewer } from '../_actions/link.actions';

export default function ViewerAuth({
  link_id,
  is_email_required,
  is_password_required,
}: Pick<
  LinkViewType,
  'link_id' | 'is_email_required' | 'is_password_required'
>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<boolean>(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const handleAuthorizeViewer = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const authorizePromise = new Promise<string>(async (resolve, reject) => {
      try {
        const { data, error } = await authorizeViewer({
          link_id,
          email,
          password,
        });

        if (error || !data) {
          console.error(error);
          reject(error);
          return;
        }

        resolve(data);
        router.refresh();
      } catch (error) {
        reject();
      } finally {
        setIsLoading(false);
      }
    });

    await toast.promise(authorizePromise, {
      loading: 'Authorizing...',
      success: (data: string) =>
        `Authorization successful - Loading document...`,
      error: (e: string) => (
        <p>{e ?? 'Authorization failed! Please try again'}</p>
      ),
    });
  };

  const validateEmail = (email: string) => {
    // Regular expression for basic email validation
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value) ? false : true);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    setPasswordError(e.target.value.length > 0 ? false : true);
  };

  const handleSubmit = (e: any) => {
    if (emailError) {
      e.preventDefault();
      return;
    }

    if (passwordError) {
      e.preventDefault();
      return;
    }

    handleAuthorizeViewer(e);
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center ">
      <div className="flex min-h-[400px] w-[576px] max-w-[80vw] flex-col items-center justify-center gap-y-6 rounded-lg bg-white p-4 text-center shadow-lg sm:p-6 lg:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-blue-700 text-center font-mono text-3xl font-bold text-white shadow-inner ring-2 ring-blue-700 ring-offset-1">
          <LockClosedIcon className="h-5 w-5" />
        </div>
        <p className="text-sm ">
          {!is_email_required && !is_password_required
            ? 'By continuing, you affirm that you have received permission from the author to view the document'
            : 'The author requires the following details to view the document'}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center space-y-6"
        >
          {is_email_required && (
            <div className="flex w-full flex-col flex-1 items-center gap-y-2">
              <p className="w-full text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                Email
              </p>
              <input
                name="email"
                type="email"
                onChange={handleEmailChange}
                value={email}
                className="w-full !shrink-0 !rounded-md !border !border-gray-200 !p-2 !shadow-inner"
                autoFocus={true}
                disabled={isLoading}
              />
            </div>
          )}
          {is_password_required && (
            <div className="flex w-full flex-col flex-1 items-center gap-y-2">
              <p className="w-full text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                Password
              </p>
              <input
                name="password"
                type="password"
                onChange={handlePasswordChange}
                value={password}
                className="w-full !shrink-0 !rounded-md !border !border-gray-200 !p-2 !shadow-inner"
                autoFocus={true}
                disabled={isLoading}
              />
            </div>
          )}

          <Button
            variant="solid"
            size="md"
            className="flex h-12 w-full max-w-[160px] items-center justify-center"
            disabled={isLoading || emailError || passwordError}
          >
            {isLoading ? <Loader size="xs" /> : 'Continue'}
          </Button>
        </form>

        <p className="max-w-sm text-xs text-gray-500">
          This information will be shared with the author.
          <br /> For more info, please read our{' '}
          <Link href="/privacy" className="text-blue-700 hover:underline">
            privacy policy
          </Link>
        </p>
      </div>
    </section>
  );
}
