import ViewsFilter from "./_components/viewsFilter";

/*=========================================== COMPONENT ===========================================*/

export default function ViewsPage({
  params: { document_id }, // will be a page or nested layout
}: {
  params: { document_id: string };
}) {
  return <ViewsFilter />;
}
