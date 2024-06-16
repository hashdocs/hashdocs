import Empty from "@/app/_components/navigation/empty";
import { primaryNavigation } from "@/app/_components/navigation/routes.constants";

export default function DataroomPage() {
  const pageProps = primaryNavigation.find((page) => page.path === "/dataroom");

  return (
    <section className="flex flex-col flex-1">
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-1">
          <h1 className="text-lg font-semibold text-shade-pencil-black">
            {pageProps?.name}
          </h1>
          <p className="text-sm text-shade-gray-500">
            {pageProps?.description}
          </p>
        </div>
      </div>
      <Empty />
    </section>
  );
}
