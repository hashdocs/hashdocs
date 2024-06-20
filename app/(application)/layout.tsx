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
  const org = await getOrg();

  return (
    <OrgProvider org_data={org}>
      <DocumentProvider>
        <div className="flex h-full max-h-[100vh] w-full max-w-[100vw] flex-1 overflow-hidden">
          <MainSidebar />
          <div className="flex w-full lg:min-w-[816px] flex-1 flex-col">
            <TopBar />
            <MobileTopBar />
            <section className="hashdocs-scrollbar flex h-full w-full flex-1 flex-col items-center !overflow-y-scroll !overflow-x-hidden bg-gray-50">
              <div className="flex w-full max-w-screen-xl flex-1 flex-col py-4 pl-4 pr-2">
                {children}
              </div>
            </section>
          </div>
        </div>
      </DocumentProvider>
    </OrgProvider>
  );
}
