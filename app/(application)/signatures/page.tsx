import { primaryNavigation } from "@/app/_components/navigation/routes.constants";
import Empty from "@/app/_components/navigation/empty";

export default function SignaturePage() {
  const pageProps = primaryNavigation.find(
    (page) => page.path === "/signatures"
  );

  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-1">
          <h1 className="text-lg font-semibold text-shade-pencil-black">
            {pageProps?.name}
          </h1>
          <p className="text-sm text-shade-pencil-light">
            {pageProps?.description}
          </p>
        </div>
      </div>
      <Empty />
    </section>
  );
}
