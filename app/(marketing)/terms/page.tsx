import { parseMarkdownContent } from "@/app/_lib/markdownParser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms and conditions of Hashdocs and associated services",
  openGraph: {
    title: "Terms",
    description: "The terms and conditions of Hashdocs and associated services",
  },
};

export default async function TermsPage() {
  const tnc = await parseMarkdownContent(`app/(marketing)/terms/content`);

  return (
    <main className="flex flex-col max-w-screen-xl relative px-4">
      <h1 className="text-4xl font-semibold my-10">Terms and Conditions</h1>
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: `${tnc.contentHtml}` }}
      ></div>
    </main>
  );
}
//mx-auto flex h-full w-full flex-col place-items-start justify-center lg:container lg:px-16
