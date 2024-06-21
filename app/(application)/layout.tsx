import MobileTopBar from './_components/mobileTopBar';
import MainSidebar from './_components/sidebar';
import TopBar from './_components/topbar';
import { getOrg } from './_provider/org.actions';
import { OrgProvider } from './_provider/useOrg';
import { DocumentProvider } from './documents/_provider/useDocument';

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { org, user } = await getOrg();

  return (
    <OrgProvider org_data={org} user={user}>
      <div className="flex h-full max-h-[100vh] w-full max-w-[100vw] flex-1 overflow-hidden">
        <MainSidebar />
        <div className="flex w-full flex-1 flex-col lg:min-w-[816px]">
          <TopBar />
          <MobileTopBar />
          <section className="hashdocs-scrollbar flex h-full w-full flex-1 flex-col items-center !overflow-x-hidden !overflow-y-scroll bg-gray-50">
            <div className="flex w-full flex-1 flex-col py-4 pl-4 pr-2">
              <DocumentProvider>{children}</DocumentProvider>
            </div>
          </section>
        </div>
      </div>
    </OrgProvider>
  );
}
