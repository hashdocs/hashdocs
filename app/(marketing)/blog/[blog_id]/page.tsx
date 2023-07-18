/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import React from "react";
import { parseBlogMarkdown } from "@/app/_lib/blogParser";
import { Metadata } from "next";

export async function generateMetadata({
  params: { blog_id }, // will be a page or nested layout
}: {
  params: { blog_id: string };
}): Promise<Metadata> {
  const blogData = await parseBlogMarkdown(blog_id);

  return {
    title: blogData.title,
    description: blogData.description,
    openGraph: {
      title: blogData.title,
      description: blogData.description,
      siteName: "Hashdocs",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog-assets/${blog_id}/hero.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: blogData.title ?? "Hashdocs - an open source docsend alternative",
      description: "Securely view this document with Hashdocs",
      siteId: "1467726470533754880",
      creator: "@rbkayz",
      creatorId: "1467726470533754880",
      images: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/blog-assets/${blog_id}/hero.png`,
      ],
    },
  };
}

export interface BlogType {
  blog_id: string;
  title: string;
  description: string;
  date: string;
  length: string;
  image: string;
  tags: string[];
  content: string;
  related_blogs: {
    blog_id: string;
    title: string;
  }[];
}

export default async function BlogIdPage({
  params: { blog_id },
}: {
  params: { blog_id: string };
}) {
  const blogData = await parseBlogMarkdown(blog_id);

  if (blogData.blog_id !== blog_id) throw Error("Blog not found");

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col items-center px-4 py-8 text-center">
      <div className="grid w-full flex-1 grid-cols-12 gap-4">
        <div className="col-span-12 my-2 lg:col-span-2">
          <Link
            href="/blog"
            className="flex cursor-pointer items-center text-sm font-semibold text-shade-pencil-light transition hover:text-shade-pencil-black"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back
          </Link>
        </div>
        <div className="text-left lg:col-span-10">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-3xl font-bold leading-none">
              {blogData.title}
            </h1>
            <div className="flex gap-x-2 text-sm text-shade-pencil-light">
              <p>{blogData.date}</p>
              <p>•</p>
              <p>{blogData.length}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 py-8 lg:gap-8">
            <div className="col-span-12 lg:col-span-7">
              {" "}
              <div
                className="prose prose-base max-w-full"
                dangerouslySetInnerHTML={{ __html: `${blogData.content}` }}
              ></div>
            </div>
            <div className="col-span-12 lg:col-span-1"></div>
            <div className="col-span-12 lg:col-span-4">
              <div className="flex flex-col lg:sticky lg:top-24">
                <div className="py-1 text-base font-semibold">
                  Related articles
                </div>
                {blogData.related_blogs.map((b) => {
                  return (
                    <Link
                      href={`/blog/${b.blog_id}`}
                      key={b.blog_id}
                      className="py-1 hover:text-stratos-default"
                    >
                      {b.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
