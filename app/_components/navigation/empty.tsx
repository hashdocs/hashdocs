import { ClockIcon } from "@heroicons/react/24/outline";

export default function Empty() {
  return (
    <div className="flex h-full w-full flex-1 flex-col space-y-4 items-center justify-center rounded-lg text-center ">
      <div className="flex space-x-2 items-center justify-center">
        <ClockIcon className="h-9 w-9 text-shade-disabled"/><h1 className="text-2xl text-shade-disabled uppercase">Coming Soon</h1>
      </div>

      <p className="text-sm text-shade-disabled underline">
        Our roadmap
      </p>
    </div>
  );
}
