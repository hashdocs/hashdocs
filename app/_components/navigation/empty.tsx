import {
  BeakerIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { FiTwitter } from "react-icons/fi";

export default function Empty() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-24 text-center ">
      <div className="flex items-center justify-center space-x-2">
        <WrenchScrewdriverIcon className="h-6 w-6 text-shade-pencil-light" />
        <h1 className="text-xl text-shade-pencil-light">WIP</h1>
      </div>

      <Link
        href={`https://twitter.com/intent/tweet?text=%40rbkayz`}
        className="text-sm text-shade-pencil-light underline hover:text-stratos-default"
      >
        Tweet to us about the feature you want to see next
      </Link>
    </div>
  );
}
