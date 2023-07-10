"use client"; // Error components must be Client Components

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="grid h-screen place-content-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">400</h1>

        <p className="text-2xl font-bold tracking-tight sm:text-4xl">
          Something broke!
        </p>

        <p className="mt-4">There was an error in loading this page.</p>

        <button
          type="button"
          onClick={() => router.push("/documents")}
          className="mt-6 inline-block rounded bg-stratos-default px-5 py-3 text-sm font-medium text-white hover:bg-stratos-default/80 focus:outline-none focus:ring"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
