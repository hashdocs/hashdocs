import { primaryNavigation } from "@/app/_components/navigation/routes.constants";
import Empty from "@/app/_components/navigation/empty";

async function getData() {
  const a = await fetch("https://hub.dummyapis.com/delay?seconds=5", {
    next: { revalidate: 0 },
  });

  return await a.text();
}

export default async function SettingsPage() {
  const str = await getData();

  const pageProps = primaryNavigation.find((page) => page.path === "/settings");

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
