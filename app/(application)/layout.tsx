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
        <div className="flex h-full w-full flex-1 overflow-hidden">
          <MainSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <TopBar />
            <MobileTopBar />
            <section className="flex h-full w-full flex-1 flex-col items-center bg-gray-50 hashdocs-scrollbar !overflow-y-scroll">
              <div className="flex w-full max-w-screen-xl flex-1 flex-col px-4 ">
                {children}
              </div>
            </section>
          </div>
        </div>
      </DocumentProvider>
    </OrgProvider>
  );
}
