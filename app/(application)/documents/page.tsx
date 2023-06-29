"use client";
import { primaryNavigation } from "@/app/_components/navigation/routes.constants";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import DocumentsList from "./_components/documentsList";
import { useEffect, useState } from "react";
import UploadDocumentModal from "./_components/uploadDocument";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

/*=========================================== COMPONENT ===========================================*/

export default function DocumentsPage() {
  const pageProps = primaryNavigation.find(
    (page) => page.path === "/documents"
  );

  if (!pageProps) {
    throw new Error("Error in rendering document page properties");
  }

  const [showUploadModal, setShowUploadModal] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const login = params.get("login") ? true : false;

    if (login) {
      toast.success("Authorization successful! Welcome to hashdocs", {
        id: "login-success",
      });

      router.push("/documents");
    }
  }, []);

  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-semibold text-shade-pencil-black">
            {pageProps.name}
          </h3>
          <p className="text-sm text-shade-pencil-light">
            {pageProps.description}
          </p>
        </div>
        {
          <LargeButton
            ButtonText={"Upload Document"}
            ButtonIcon={DocumentPlusIcon}
            ButtonId={"upload-document"}
            ButtonClassName="bg-stratos-gradient hover:bg-stratos-gradient/80 text-white"
            onClick={() => setShowUploadModal(true)}
          />
        }
      </div>
      <DocumentsList />
      <UploadDocumentModal
        isOpen={showUploadModal}
        setIsOpen={setShowUploadModal}
      />
    </section>
  );
}
