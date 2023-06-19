'use client';
import { usePathname } from "next/navigation";
import { primaryNavigation } from "./routes.constants";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function splitPath(path: string) {
  const pathArray: { name: string; path: string }[] = [];
  let currentPart = "";

  for (const item of path.split("/").filter(Boolean)) {
    currentPart += "/" + item;
    pathArray.push({ name: item, path: currentPart });
  }

  return pathArray;
}

export default function TopBar() {
  const path = usePathname();

  const pathArray = splitPath(path);

  const primaryPageProps = primaryNavigation.find(
    (page) => page.path.toLowerCase() === pathArray[0].path.toLowerCase()
  );

  const secondaryPages = pathArray.slice(1);

  return (
    <div className="hidden w-full xl:justify-center xl:flex xl:flex-col xl:h-12 xl:border-b xl:border-shade-line xl:px-8 bg-shade-overlay">
      <div className="flex flex-row items-center gap-x-2 text-sm lowercase text-shade-pencil-light">
        {primaryPageProps && (
          <primaryPageProps.icon
            key={`${primaryPageProps.path}-icon`}
            className={classNames("h-4 w-4")}
            aria-hidden="true"
          />
        )}
        {primaryPageProps && (
          <Link href={primaryPageProps.path}>
            <h3 className="hover:text-shade-pencil-dark">
              {primaryPageProps?.name}
            </h3>
          </Link>
        )}
        {secondaryPages &&
          secondaryPages.map((page) => (
            // <>

            <Link
              key={`${page.path}`}
              href={page.path}
              className="flex flex-row gap-x-2"
            >
              <div className="text-sm font-semibold">{"/"}</div>
              <h3 className="hover:text-shade-pencil-dark">{page.name}</h3>
            </Link>
            // </>
          ))}
      </div>
    </div>
  );
}
