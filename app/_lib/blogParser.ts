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

const folderPath = `blog-content`;

export const parseBlogMarkdown = async (blog_id: string) => {
  let blogData: BlogType = {
    blog_id: "",
    title: "",
    date: "",
    length: "",
    image: "",
    tags: [],
    content: "",
    related_blogs: [],
  };

  fs.readdirSync(folderPath).forEach(async (file) => {
    if (file === `${blog_id}.md`) {
      const blogPath = path.join(folderPath, `${blog_id}.md`);

      const blogContent = fs.readFileSync(blogPath, "utf8");

      const blogMatterResult = matter(blogContent);

      // Use remark to convert markdown into HTML string
      const processedContent = await unified()
        .data("settings", { fragment: true })
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings)
        .process(blogMatterResult.content);

      const content = processedContent.toString();

      blogData.blog_id = blog_id;
      blogData.title = blogMatterResult.data.title;
      blogData.date = blogMatterResult.data.date;
      blogData.length = blogMatterResult.data.length;
      blogData.image = blogMatterResult.data.image;
      blogData.content = content;
      blogData.tags = blogMatterResult.data.tags as string[];

      fs.readdirSync(folderPath).forEach(async (file) => {
        if (file !== `${blog_id}.md`) {
          const blogPath = path.join(folderPath, file);

          const fileContents = fs.readFileSync(blogPath, "utf8");

          const matterResult = matter(fileContents);

          const tags = matterResult.data.tags as string[];

          if (tags.some((item) => blogData.tags.includes(item))) {
            blogData.related_blogs.push({
              blog_id: matterResult.data.blog_id,
              title: matterResult.data.title,
            });
          }
        }
      });
    }
  });

  return blogData;
};

export const parseBlogs = async () => {
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
