import { parseBlogs } from "@/app/_lib/blogParser";
import Image from "next/image";
import Link from "next/link";

export default async function Blog() {
  const blogData = await parseBlogs();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col items-center px-4 py-8 text-center">
      <ol className="grid grid-cols-12 py-16 lg:gap-16">
        {blogData.map((blog) => {
          return (
            <div className="col-span-12 lg:col-span-4">
              <Link href={`/blog/${blog.blog_id}`}>
                <div className="group min-w-full transition hover:scale-105">
                  <div className="flex flex-col space-y-3">
                    <div className="w-full overflow-hidden rounded-lg object-contain shadow-sm lg:max-h-56">
                      <Image
                        alt="thumbnail"
                        src={`${blog.image}`}
                        width={500}
                        height={250}
                      />
                    </div>
                    <p className="max-w-sm text-xl">
                      {blog.title}
                    </p>
                    <p className="text-xs">
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
