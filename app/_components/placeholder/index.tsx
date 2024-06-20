import {
  WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-lg border-2 border-dashed p-24 text-center ">
      <div className="flex items-center justify-center gap-x-2">
        <WrenchScrewdriverIcon className="h-6 w-6 text-gray-500" />
        <h1 className="text-xl text-gray-500">WIP</h1>
      </div>

      <Link
        href={`https://twitter.com/intent/tweet?text=%40rbkayz`}
        className="text-sm text-gray-500 underline hover:text-blue-700"
      >
        Tweet to us about the feature you want to see next
      </Link>
    </div>
  );
}
