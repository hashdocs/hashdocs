import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid h-screen place-content-center px-4">
      <div className="text-center gap-x-4">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="text-lg tracking-tight text-shade-disabled">
          This page does not exist!
        </p>

        <Link href={`/`}
          type="button"
          className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-stratos-default rounded hover:bg-stratos-default/80 focus:outline-none focus:ring"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}
