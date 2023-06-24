"use client"; // Error components must be Client Components

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

  return (
    <div className="grid h-screen px-4 place-content-center">
      <div className="text-center">
        <h1 className="font-black text-gray-200 text-9xl">400</h1>

        <p className="text-2xl font-bold tracking-tight sm:text-4xl">
          Something broke!
        </p>

        <p className="mt-4">
          There was an error in loading this page.
        </p>

        <button
          type="button"
          className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
