export default function InvalidLink() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="text-2xl font-bold tracking-tight sm:text-4xl">
          Invalid link!
        </p>

        <p className="mt-4">
          This link is invalid or expired! Please contact the sender for a new
          link
        </p>
      </div>
    </div>
  );
}
