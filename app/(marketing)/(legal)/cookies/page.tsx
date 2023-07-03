import { parseMarkdownContent } from "@/app/_lib/markdownParser";
import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Cookie Policy",
//   description: "Details on the cookies used and stored by the Hashlabs platform",
//   openGraph: {
//     title: "Cookie Policy",
//     description: "Details on the cookies used and stored by the Hashlabs platform",
//   },
// };

export default async function CookiesPage() {
  const content = await parseMarkdownContent(`app/(marketing)/(legal)/cookies/content`);

  return (
    <main className="flex flex-col max-w-screen-xl relative px-4 my-8">
      <h1 className="text-4xl font-black my-10">Cookie Policy</h1>
      <div
        className="prose prose-base"
        dangerouslySetInnerHTML={{ __html: `${content.contentHtml}` }}
      ></div>
    </main>
  );
}
//mx-auto flex h-full w-full flex-col place-items-start justify-center lg:container lg:px-16
