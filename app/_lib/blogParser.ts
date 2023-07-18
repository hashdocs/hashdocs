import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { BlogType } from "../(marketing)/blog/[blog_id]/page";

const markdownDirectory = path.join(process.cwd());

export const parseBlogMarkdown = async (blog_id: string) => {
  const folderPath = path.join(
    markdownDirectory,
    `/app/(marketing)/blog/[blog_id]/content/`
  );

  const blogPath = path.join(folderPath, `${blog_id}.md`);

  try {
    const blogContent = fs.readFileSync(blogPath, "utf8");

    console.log("blog found", blogContent);

    const blogMatterResult = matter(blogContent);

    console.log("blog matter result", blogMatterResult);

    // Use remark to convert markdown into HTML string
    const processedContent = await unified()
      .data("settings", { fragment: true })
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .process(blogMatterResult.content);

    console.log("processed content", processedContent);

    const content = processedContent.toString();

    console.log("content", content);

    let blogData: BlogType = {
      blog_id: blog_id,
      title: blogMatterResult.data.title,
      date: blogMatterResult.data.date,
      length: blogMatterResult.data.length,
      image: blogMatterResult.data.image,
      content: content,
      tags: blogMatterResult.data.tags,
      related_blogs: [],
    };

    fs.readdirSync(folderPath).forEach(async (file) => {
      if (file === `${blog_id}.md`) return;

      const fileContents = fs.readFileSync(path.join(folderPath, file), "utf8");

      const matterResult = matter(fileContents);

      const tags = matterResult.data.tags as string[];

      if (tags.some((item) => blogData.tags.includes(item))) {
        blogData.related_blogs.push({
          blog_id: matterResult.data.blog_id,
          title: matterResult.data.title,
        });
      }
    });

    return blogData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const parseBlogs = async () => {
  const folderPath = path.join(
    markdownDirectory,
    `/app/(marketing)/blog/[blog_id]/content/`
  );

  let blogData: {
    blog_id: string;
    title: string;
    date: string;
    length: string;
    image: string;
  }[] = [];

  fs.readdirSync(folderPath).forEach(async (file) => {
    const fileContents = fs.readFileSync(path.join(folderPath, file), "utf8");

    const matterResult = matter(fileContents);

    blogData.push({
      blog_id: matterResult.data.blog_id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      length: matterResult.data.length,
      image: matterResult.data.image,
    });
  });

  return blogData;
};
