import LargeButton from "@/app/_components/shared/buttons/largeButton";
import { DocumentPlusIcon } from "@heroicons/react/20/solid";
import { LinkIcon } from "@heroicons/react/24/outline";

export default function EmptyLinks() {


  return (
    <div className="text-center flex items-center flex-col gap-y-4 pt-12 pb-16 my-4 border-shade-line border-2 border-dashed">
      <div className="flex flex-col gap-y-1">
          <h3 className="text-sm font-semibold text-shade-pencil-black">
            No links
          </h3>
          <p className="text-sm text-shade-pencil-light">
            Create a secure link for this document
          </p>
      </div>
      {/* <LargeButton
        ButtonText={"New Link"}
        ButtonIcon={LinkIcon}
        ButtonClassName={document.is_enabled
          ? `w-28 bg-stratos-gradient hover:bg-stratos-gradient/80 text-white`
          : `w-28 bg-shade-disabled cursor-not-allowed`}
        onClick={() => setShowNewLinkModal(true)} ButtonId={""}            /> */}
    </div>
  );
}
