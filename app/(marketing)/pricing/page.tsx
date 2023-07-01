import { parseMarkdownContent } from "@/app/_lib/markdownParser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Information on the pricing and billing terms of Hashdocs",
  openGraph: {
    title: "Privacy",
    description: "Information on the pricing and billing terms of Hashdocs",
  },
};

export default async function PricingPage() {

  return (
    <main className="relative flex-1 my-8 flex max-w-screen-xl flex-col px-4">
      <h1 className="my-10 text-4xl font-black">Pricing</h1>
      <div className="prose prose-base">
        The hashdocs platform is free to use. We are building a pro tier for
        advanced features and customizations
      </div>
    </main>
  );
}
//mx-auto flex h-full w-full flex-col place-items-start justify-center lg:container lg:px-16
