import MainSidebar from './_components/sidebar';
import TopBar from './_components/topbar';
import { getOrg } from './_provider/org.actions';
import { OrgProvider } from './_provider/useOrg';

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = await getOrg();

  return (
    <OrgProvider org_data={org}>
      <div className="flex h-full w-full flex-1 overflow-hidden">
        <MainSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <section className="hashdocs-scrollbar flex h-full w-full flex-1 flex-col justify-center items-center !overflow-y-scroll bg-gray-50">
            <div className="flex w-full max-w-screen-xl flex-1 flex-col p-4 ">
              {children}
            </div>
          </section>
        </div>
      </div>
    </OrgProvider>
  );
}
