import { parseMarkdownContent } from "@/app/_lib/markdownParser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Information on how we handle, process and protect your personal data",
  openGraph: {
    title: "Privacy Policy",
    description: "Information on how we handle, process and protect your personal data",
  },
};

export default async function PrivacyPage() {
  const content = await parseMarkdownContent(`app/(marketing)/(legal)/privacy/content`);

  return (
    <main className="flex flex-col max-w-screen-xl relative px-4 my-8">
      <h1 className="text-4xl font-black my-10">Privacy Policy</h1>
      <div
        className="prose prose-base"
        dangerouslySetInnerHTML={{ __html: `${content.contentHtml}` }}
      ></div>
    </main>
  );
}
//mx-auto flex h-full w-full flex-col place-items-start justify-center lg:container lg:px-16
