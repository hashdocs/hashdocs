import MobileTopBar from './[org_id]/_components/mobileTopBar';
import MainSidebar from './[org_id]/_components/sidebar';
import TopBar from './[org_id]/_components/topbar';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-full max-h-[100vh] w-full max-w-[100vw] flex-1 overflow-hidden">
      <MainSidebar />
      <div className="flex w-full flex-1 flex-col lg:min-w-[816px]">
        <TopBar />
        <MobileTopBar />
        <section className="hashdocs-scrollbar flex h-full w-full flex-1 flex-col items-center !overflow-x-hidden !overflow-y-scroll bg-gray-50">
          <div className="flex w-full flex-1 flex-col py-4 pl-4 pr-2">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
