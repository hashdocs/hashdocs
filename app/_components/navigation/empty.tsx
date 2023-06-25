import { BeakerIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function Empty() {
  return (
    <div className="flex flex-col p-24 border-2 border-dashed space-y-4 items-center justify-center rounded-lg text-center ">
      <div className="flex space-x-2 items-center justify-center">
        <BeakerIcon className="h-8 w-8 text-shade-disabled"/><h1 className="text-xl text-shade-disabled uppercase">Coming Soon</h1>
      </div>

      <p className="text-sm text-shade-disabled underline">
        Upvote your preferred features in our roadmap
      </p>
    </div>
  );
}
