import { parseBlogs } from "@/app/_lib/blogParser";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "All the latest content and updates from the Hashdocs editorial room",
  openGraph: {
    title: "Blog",
    description: "All the latest content and updates from the Hashdocs editorial room",
  },
};

export default async function Blog() {
  const blogData = await parseBlogs();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col items-center px-4 py-8 text-center">
      <ol className="grid grid-cols-12 py-16 lg:gap-16">
        {blogData.map((blog) => {
          return (
            <div className="col-span-12 lg:col-span-4" key={blog.blog_id}>
              <Link href={`/blog/${blog.blog_id}`}>
                <div className="group min-w-full">
                  <div className="flex flex-col space-y-3 text-left">
                    <div className="w-full  overflow-hidden rounded-lg object-contain border border-shade-line shadow-sm lg:max-h-56">
                      <Image
                        alt="thumbnail"
                        src={`${blog.image}`}
                        width={500}
                        height={250}
                        className="group-hover:scale-105 transition"
                      />
                    </div>
                    <p className="max-w-sm group-hover:text-stratos-default font-semibold px-2 text-xl">
                      {blog.title}
                    </p>
                    <p className="text-sm text-shade-pencil-light px-2">
                      {blog.description}
                    </p>
                    <p className="text-xs text-shade-pencil-light px-2">
                      {blog.date} • {blog.length}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </ol>
    </main>
  );
}
