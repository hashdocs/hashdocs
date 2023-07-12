"use client";
import Loader from "@/app/_components/navigation/loader";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useParams, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { ViewerContext } from "./viewerProvider";

export default function ViewerAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<boolean>(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const linkProps = useContext(ViewerContext);

  if (!linkProps) {
    return null;
  }

  const { is_email_required, is_password_required } = linkProps;

  const handleAuthorizeViewer = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const authorizePromise = new Promise(async (resolve, reject) => {
      const res = await fetch(`/api/viewer/${linkProps?.link_id}`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        resolve("success");
        router.refresh();
      } else {

        const err = await res.json();

        reject(err);
        setIsLoading(false);
      }
    });

    toast.promise(authorizePromise, {
      loading: "Authorizing...",
      success: "Authorization successful",
      error: (error_message: string) => (
        <p>{error_message ?? "Authorization failed! Please try again"}</p>
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
    handleAuthorizeViewer(e);
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center ">
      <div className="flex min-h-[400px] w-full max-w-xl flex-col items-center justify-center space-y-6 rounded-lg bg-white p-4 text-center shadow-lg sm:p-6 lg:p-8">
        <div className="bg-stratos-gradient flex h-12 w-12 items-center justify-center rounded-full border-2 text-center font-mono text-3xl font-bold text-white shadow-inner ring-2 ring-stratos-default ring-offset-1">
          <LockClosedIcon className="h-5 w-5" />
        </div>
        <p className="text-base ">
          {!is_email_required && !is_password_required
            ? "By continuing, you affirm that you have received permission from the author to view the document"
            : "The author requires the following details to view the document"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-[400px] flex-col items-center space-y-6"
        >
          {is_email_required && (
            <div className="flex w-full flex-1 items-center space-x-4">
              <p className="basis-1/4 text-right text-xs font-semibold uppercase tracking-wide text-shade-pencil-light ">
                Email
              </p>
              <input
                name="email"
                type="email"
                onChange={handleEmailChange}
                value={email}
                className="shrink-0 basis-3/4 rounded-md border border-shade-line p-2 shadow-inner focus:ring-1 focus:ring-stratos-default"
                autoFocus={true}
                disabled={isLoading}
              />
            </div>
          )}
          {is_password_required && (
            <div className="flex w-full flex-1 items-center space-x-4">
              <p className="basis-1/4 text-right text-xs font-semibold uppercase tracking-wide text-shade-pencil-light ">
                Password
              </p>
              <input
                name="password"
                type="password"
                onChange={handlePasswordChange}
                value={password}
                className="shrink-0 basis-3/4 rounded-md border border-shade-line p-2 shadow-inner focus:ring-1 focus:ring-stratos-default"
                autoFocus={true}
                disabled={isLoading}
              />
            </div>
          )}

          {isLoading ? (
            <div className="h-11 w-11">
              <Loader />
            </div>
          ) : (
            <button
              className="bg-stratos-gradient hover:bg-stratos-gradient/80 w-40 rounded-lg px-3 py-3 font-semibold text-white disabled:bg-stratos-line"
              disabled={isLoading || emailError || passwordError}
            >
              Continue
            </button>
          )}
        </form>

        <p className="text-xs text-shade-pencil-light ">
          This information will be shared with the author. Please visit our{" "}
          <a href="/privacy" className="text-stratos-default hover:underline">
            privacy policy
          </a>{" "}
          to know more.
        </p>
      </div>
    </section>
  );
}
