export default function InvalidLink() {
  return (
    <div className="flex flex-1 flex-col text-center space-y-4 items-center justify-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>

      <p className="text-2xl font-bold">
      This link is invalid or expired!
      </p>

      <p className="">
        Please contact the author for a new link
      </p>
    </div>
  );
}
