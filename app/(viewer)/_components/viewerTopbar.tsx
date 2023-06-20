import Link from "next/link";
import Image from "next/image";

export default function ViewerTopBar() {
  return (
    <div className="w-full bg-shade-overlay flex h-12 border-b border-shade-line px-4">
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}`}
        className="flex flex-row items-center"
      >
        <div className="relative -ml-1 h-12 w-9 scale-50 overflow-hidden rounded-md">
          <Image src={"/hashdocs_logo.svg"} fill={true} alt={"hashdocs"} />
        </div>
        <h1 className="ml-1 text-2xl font-bold leading-6 tracking-wide">
          hashdocs
        </h1>
      </Link>
    </div>
  );
}
