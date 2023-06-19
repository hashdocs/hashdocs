import Link from "next/link";
import toast from "react-hot-toast";

// Copy link to clipboard
export const CopyLinkToClipboard = async (
  copyText: string,
  isToast: boolean = true,
  toastId?: string
) => {
  const copyPromise = navigator.clipboard.writeText(`${copyText}`);

  isToast &&
    toast.promise(
      copyPromise,
      {
        loading: "Copying...",
        success: (
          <p className="font-normal">
            Successfully copied{" "}
            <Link
              href={copyText}
              target="_blank"
              className="font-semibold text-stratos-default underline"
            >
              {copyText}
            </Link>{" "}
            to clipboard
          </p>
        ),
        error: `An error occured while copying! Please copy manually`,
      },
      {
        id: toastId,
      }
    );
};
