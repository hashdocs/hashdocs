import {
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon,
  CodeBracketSquareIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { CheckCheckIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

interface ComparisonProps {
  icon: React.ForwardRefExoticComponent<any>;
  title: string;
  description: string;
  hashdocs: JSX.Element;
  docsend: JSX.Element;
}

const comparisonList: ComparisonProps[] = [
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Advanced link controls",
    description:
      "Restrict viewers by email domain, passcode, 2FA verification & more",
    hashdocs: (
      <>
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"Available in all plans"}
        </p>
      </>
    ),
    docsend: (
      <>
        <ExclamationCircleIcon className="h-5 w-5 text-amber-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"Only in advanced ($250/m)"}
        </p>
      </>
    ),
  },
  {
    icon: LockClosedIcon,
    title: "Secure viewer",
    description: "Add watermarks and prevent viewers saving images or printing",
    hashdocs: (
      <>
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"No save as images or printing"}
        </p>
      </>
    ),
    docsend: (
      <>
        <XCircleIcon className="h-5 w-5 text-red-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"Allows saving as images"}
        </p>
      </>
    ),
  },
  {
    icon: CheckBadgeIcon,
    title: "Custom domains",
    description:
      "Whitelabel your links and viewer with custom domains and company logo",
    hashdocs: (
      <>
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"In alpha. coming soon"}
        </p>
      </>
    ),
    docsend: (
      <>
        <ExclamationCircleIcon className="h-5 w-5 text-amber-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"Only for enterprises"}
        </p>
      </>
    ),
  },
  {
    icon: CodeBracketSquareIcon,
    title: "Open source",
    description: "Audit our code, build your own integrations or self-deploy",
    hashdocs: (
      <>
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <Link
          href={`https://github.com/hashdocs/hashdocs`}
          target="_blank"
          className="text-sm font-normal text-shade-pencil-dark"
        >
          {"Star us on Github"}
        </Link>
      </>
    ),
    docsend: (
      <>
        <XCircleIcon className="h-5 w-5 text-red-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"No self deployment"}
        </p>
      </>
    ),
  },
  {
    icon: CreditCardIcon,
    title: "Simple pricing",
    description:
      "Access all our features in one plan, with no hidden fees or limits",
    hashdocs: (
      <>
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <Link
          href={`https://github.com/hashdocs/hashdocs`}
          className="text-sm font-normal text-shade-pencil-dark"
        >
          {"Free plan + simple pricing tier"}
        </Link>
      </>
    ),
    docsend: (
      <>
        <XCircleIcon className="h-5 w-5 text-red-600" />
        <p className="text-sm font-normal text-shade-pencil-dark">
          {"No free tier; 4 complex tiers"}
        </p>
      </>
    ),
  },
];

const Comparison = () => {
  return (
    <div
      id="comparison"
      className="flex w-full flex-col items-center border-t border-shade-line px-4 py-8"
    >
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-4 text-center">
        <h1 className="text-2xl font-extrabold sm:text-5xl">
          <span className="text-stratos-gradient">1000+ teams </span>
          switched from Docsend
        </h1>
        <h2 className="max-w-xl py-4 text-lg">
          Here&apos;s why - a comparison of Hashdocs vs Docsend
        </h2>
      </div>

      <div className="my-4 flex w-full max-w-screen-xl flex-col rounded-md border bg-white">
        <div className="mx-4 flex py-4 font-semibold">
          <div className="basis-1/2 mr-2">{""}</div>
          <div className="flex basis-1/4 justify-center">
            <div className="flex flex-row items-center">
              <div className="relative h-10 w-8 scale-75 rounded-md">
                <Image
                  src={"/hashdocs_gradient.svg"}
                  fill={true}
                  alt={"Hashdocs"}
                />
              </div>
              <header className="ml-1 mt-1 hidden text-2xl font-black leading-6 tracking-wide xl:block">
                Hashdocs
              </header>
            </div>
          </div>
          <div className="flex basis-1/4 justify-center">
            <div className="flex flex-row items-center">
              <div className="relative h-8 w-8 scale-75 rounded-md">
                <Image
                  src={"/images/docsend_logo.png"}
                  fill={true}
                  alt={"Hashdocs"}
                />
              </div>
              <header className="ml-1 hidden text-2xl font-bold leading-6 tracking-wide xl:block">
                Docsend
              </header>
            </div>
          </div>
        </div>
        {comparisonList.map((item) => {
          return (
            <div className="mx-4 flex border-t border-dotted border-shade-line py-6 " key={item.title}>
              <div className="basis-1/2 mr-2 flex-col text-left xl:flex-row">
                <h3 className="items-center gap-x-2 text-base font-semibold text-shade-pencil-dark xl:inline-flex">
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </h3>
                <p className="pr-2 text-sm font-normal text-shade-pencil-dark">
                  {item.description}
                </p>
              </div>
              <div className="flex basis-1/4 flex-col items-center text-center gap-y-1">
                {item.hashdocs}
              </div>
              <div className="flex basis-1/4 flex-col items-center text-center gap-y-1">
                {item.docsend}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comparison;
