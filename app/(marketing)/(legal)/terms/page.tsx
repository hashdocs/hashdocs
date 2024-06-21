import { parseMarkdownContent } from "@/app/_utils/markdownParser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Information on the terms and conditions to use the Hashdocs platform",
  openGraph: {
    title: "Terms",
    description: "Information on the terms and conditions to use the Hashdocs platform",
  },
};

export default async function TermsPage() {
  const content = await parseMarkdownContent(`app/(marketing)/(legal)/terms/content`);

  return (
    <main className="flex flex-col max-w-screen-xl relative px-4 my-8">
    <h1 className="text-4xl font-black my-10">Terms and conditions</h1>
    <div
      className="prose prose-base"
      dangerouslySetInnerHTML={{ __html: `${content.contentHtml}` }}
    ></div>
  </main>
  );
}
//mx-auto flex h-full w-full flex-col place-items-start justify-center lg:container lg:px-16
