import Loader from "@/app/_components/navigation/loader";
import { getDocument } from "../layout";
import ViewsFilter from "./_components/viewsFilter";

/*=========================================== COMPONENT ===========================================*/

export default async function ViewsPage({
  params: { document_id }, // will be a page or nested layout
}: {
  params: { document_id: string };
}) {
  const document = await getDocument(document_id);

  return document ? <ViewsFilter {...document} /> : <Loader />;
}
