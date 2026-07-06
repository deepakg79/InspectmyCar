import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function POST(req: NextRequest) {

    try {

        const blog = await req.json();

        const readTime =
            Math.max(
                1,
                Math.ceil(
                    blog.content
                        .replace(/<[^>]+>/g, "")
                        .split(/\s+/)
                        .filter(Boolean)
                        .length / 220
                )
            ) + " min read";

        const now = new Date().toISOString();

        await adminDb
            .collection("blogs")
            .doc(blog.slug)
            .set({

                slug: blog.slug,

                title: blog.title,

                excerpt: blog.excerpt,

                category: blog.category,

                heroImage: blog.heroImage ?? "",

                content: blog.content,

                seoTitle: blog.seoTitle,

                seoDescription: blog.seoDescription,

                readTime,

                published: true,

                publishedAt: now,

                updatedAt: now,

            });

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