"use client";
import Loader from "@/app/_components/navigation/loader";
import {
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ViewerAuth() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(true);
  const router = useRouter();
  // const [password, setPassword] = useState("");

  const { link_id } = useParams();

  const handleAuthorizeViewer = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // const authorizePromise = new Promise(async (resolve, reject) => {
    const res = await fetch(`/api/viewer/${link_id}`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      toast.success("Authorization successful");
    } else {
      toast.error("Authorization failed! Please try again");
    }
    // });

    // toast.promise(authorizePromise, {
    //   loading: "Authorizing...",
    //   success: "Authorization successful",
    //   error: "Authorization failed! Please try again",
    // });
    setIsLoading(false);
    router.refresh();
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

  const handleSubmit = (e: any) => {
    if (emailError) {
      e.preventDefault();
      return;
    }
    handleAuthorizeViewer(e);
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center ">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex min-h-[400px] w-1/3 flex-col items-center justify-center space-y-6 rounded-lg bg-white p-4 text-center shadow-lg sm:p-6 lg:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-stratos-default text-center font-mono text-3xl font-bold text-white shadow-inner ring-2 ring-stratos-default ring-offset-1">
            <LockClosedIcon className="w-5 h-5" />
          </div>
          <p className="text-base ">
            The author requires the following details to view the document
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-6"
          >
            <div className="flex items-center space-x-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-shade-pencil-light ">
                Email
              </p>
              <input
                name="email"
                type="email"
                onChange={handleEmailChange}
                value={email}
                className="w-80 rounded-md border border-shade-line p-2 shadow-inner focus:ring-1 focus:ring-stratos-default"
                autoFocus={true}
                disabled={isLoading}
              />
            </div>

            <button
              className="w-40 rounded-lg bg-stratos-default px-3 py-3 font-semibold text-white hover:bg-stratos-default/80 disabled:bg-stratos-line"
              disabled={isLoading || emailError}
            >
              Continue
            </button>
          </form>

          <p className="text-xs text-shade-pencil-light ">
            This information will be shared with the author. Please visit our{" "}
            <a href="/privacy" className="text-stratos-default hover:underline">
              privacy policy
            </a>{" "}
            to know more.
          </p>
        </div>
      )}
    </section>
  );
}
