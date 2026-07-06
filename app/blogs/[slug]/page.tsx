import fs from "fs/promises";
import path from "path";
import BlogRenderer from "@/app/components/blog/BlogRenderer";
import { notFound } from "next/navigation";

export default async function BlogPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    try {

        const blog = JSON.parse(
            await fs.readFile(
                path.join(
                    process.cwd(),
                    "content/blogs",
                    slug,
                    "content.json"
                ),
                "utf8"
            )
        );

        return (
            <BlogRenderer
                title={blog.title}
                excerpt={blog.excerpt}
                heroImage={blog.heroImage}
                content={blog.content}
            />
        );

    } catch {

        notFound();

    }
}