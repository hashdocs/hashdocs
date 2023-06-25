import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export function ThumbnailImage({
  src = null,
  document_id,
}: {
  src?: string | null;
  document_id: string;
}) {
  const [error, setError] = useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Link
      className="relative flex h-[72px] w-[137px] shrink-0 rounded-md border object-cover"
      href={`/preview/${document_id}`}
      target="_blank"
    >
      <Image
        alt={document_id}
        onError={setError}
        src={error || !src ? "/images/default_thumbnail.png" : src}
        // fill={true}
        height={72}
        width={137}
        // style={{ objectFit: "contain" }}
      />
      <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-shade-disabled opacity-0 transition-opacity duration-200 hover:opacity-50">
        <EyeIcon className="h-6 w-6 text-shade-pencil-black" />
      </div>
    </Link>
  );
}
