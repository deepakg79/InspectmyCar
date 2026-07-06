import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";

import BlogForm from "../../BlogForm";

export default async function EditBlog({
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
                    "content",
                    "blogs",
                    slug,
                    "content.json"
                ),
                "utf8"
            )
        );

        return (
            <BlogForm
                initialData={blog}
                editMode
            />
        );

    } catch {

        notFound();

    }
}