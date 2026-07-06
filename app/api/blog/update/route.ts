import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
    try {

        const blog = await req.json();

        const root = path.join(
            process.cwd(),
            "content",
            "blogs"
        );

        const folder = path.join(
            root,
            blog.slug
        );

        await fs.mkdir(folder, {
            recursive: true,
        });

        await fs.writeFile(
            path.join(folder, "content.json"),
            JSON.stringify(blog, null, 2)
        );

        const metadataFile = path.join(
            root,
            "metadata.json"
        );

        let metadata: any[] = [];

        try {

            metadata = JSON.parse(
                await fs.readFile(
                    metadataFile,
                    "utf8"
                )
            );

        } catch { }

        const index = metadata.findIndex(
            b => b.slug === blog.slug
        );

        const card = {

            slug: blog.slug,

            title: blog.title,

            excerpt: blog.excerpt,

            category: blog.category,

            heroImage: blog.heroImage,

            date:
                metadata[index]?.date ??
                new Date().toLocaleDateString(),

            readTime:
                Math.max(
                    1,
                    Math.ceil(
                        blog.content
                            .replace(/<[^>]+>/g, "")
                            .split(/\s+/).length / 220
                    )
                ) + " min read",

        };

        if (index >= 0) {

            metadata[index] = card;

        } else {

            metadata.unshift(card);

        }

        await fs.writeFile(
            metadataFile,
            JSON.stringify(metadata, null, 2)
        );

        return NextResponse.json({
            success: true,
        });

    } catch (err) {

        console.error(err);

        return NextResponse.json(
            {
                success: false,
            },
            {
                status: 500,
            }
        );

    }
}