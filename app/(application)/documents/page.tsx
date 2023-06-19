import { primaryNavigation } from "@/app/_components/navigation/routes.constants";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import LargeButton from "@/app/_components/shared/buttons/largeButton";
import DocumentsList from "./_components/documentsList";

/*=========================================== COMPONENT ===========================================*/

export default async function DocumentsPage() {
  const pageProps = primaryNavigation.find(
    (page) => page.path === "/documents"
  );

  if (!pageProps) {
    throw new Error("Error in rendering document page properties");
  }

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
          />
        }
      </div>
      <DocumentsList />
    </section>
  );
}
