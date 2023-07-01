"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaGithub, FaTwitter } from "react-icons/fa";
import Image from "next/image";

const navigation = {
  product: [
    { name: "Pricing", href: "/pricing" },
    { name: "Roadmap", href: "/roadmap" },
  ],
  company: [
    { name: "Blog", href: "/blog" },
    { name: "Security", href: "/security" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Cookies", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="z-10 flex w-full items-center justify-center border-t border-shade-line bg-white/50">
      <div className="flex max-w-screen-xl flex-1 flex-col gap-y-4 px-4 py-8 xl:flex xl:flex-row xl:justify-between xl:gap-y-0">
        <div className="w-full space-y-4 xl:flex xl:w-1/2 xl:flex-col">
          <div className="flex items-center gap-x-2">
            <div className="relative h-10 w-8 scale-75 rounded-md">
              <Image
                src={"/hashdocs_gradient.svg"}
                fill={true}
                alt={"Hashdocs"}
              />
            </div>
            <p className="max-w-xs text-sm text-shade-pencil-light">
              An open-source Docsend alternative with powerful link controls and
              realtime tracking
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="https://twitter.com/rbkayz"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-1 transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-5 w-5 text-shade-pencil-light" />
            </Link>
            <Link
              href="https://github.com/rbkayz/hashdocs"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-1 transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
              <span className="sr-only">Github</span>
              <FaGithub className="h-5 w-5 text-shade-pencil-light" />
            </Link>
            <p className="text-sm leading-5 text-shade-disabled">
              © {new Date().getFullYear()} Hashlabs Holdings Inc.
            </p>
          </div>
        </div>
        <div className="flex flex-1 justify-between">
          <div className="my-2 flex flex-col gap-y-2">
            <h3 className="text-sm font-semibold">Product</h3>
            {navigation.product.map((item) => (
              <Link
                href={item.href}
                key={`footer-product-${item.href}`}
                className="text-sm text-shade-pencil-light hover:text-shade-pencil-black"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="my-2 flex flex-col gap-y-2">
            <h3 className="text-sm font-semibold">Company</h3>
            {navigation.company.map((item) => (
              <Link
                href={item.href}
                key={`footer-company-${item.href}`}
                className="text-sm text-shade-pencil-light hover:text-shade-pencil-black"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="my-2 flex flex-col gap-y-2">
            <h3 className="text-sm font-semibold">Legal</h3>
            {navigation.legal.map((item) => (
              <Link
                href={item.href}
                key={`footer-legal-${item.href}`}
                className="text-sm text-shade-pencil-light hover:text-shade-pencil-black"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
