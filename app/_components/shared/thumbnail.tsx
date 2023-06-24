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
    console.log("fired");
    setError(null);
  }, [src]);

  return (
    <Link className="relative flex h-[72px] w-[128px] shrink-0 rounded-md border object-cover" href={`https://${process.env.NEXT_PUBLIC_BASE_URL}/documents/${document_id}/preview`} target="_blank">
      <Image
        alt={document_id}
        onError={setError}
        src={error || !src ? "/images/no_document_fallback.png" : src}
        // fill={true}
        height={72}
        width={128}
        // style={{ objectFit: "contain" }}
      />
      <div className="absolute inset-0 flex rounded-md cursor-pointer items-center justify-center bg-shade-disabled opacity-0 transition-opacity duration-200 hover:opacity-50">
        <EyeIcon className="h-6 w-6 text-shade-pencil-black" />
      </div>
    </Link>
  );
}
