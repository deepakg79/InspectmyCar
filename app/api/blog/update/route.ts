import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function PUT(req: NextRequest) {

    try {

        const blog = await req.json();

        const ref = adminDb
            .collection("blogs")
            .doc(blog.slug);

        const snapshot = await ref.get();

        if (!snapshot.exists) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Blog not found.",
                },
                {
                    status: 404,
                }
            );

        }

        const existing = snapshot.data();

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

        await ref.update({

            title: blog.title,

            excerpt: blog.excerpt,

            category: blog.category,

            heroImage:
                blog.heroImage ||
                existing?.heroImage,

            content: blog.content,

            seoTitle:
                blog.seoTitle ??
                existing?.seoTitle,

            seoDescription:
                blog.seoDescription ??
                existing?.seoDescription,

            readTime,

            published: true,

            publishedAt:
                existing?.publishedAt,

            updatedAt:
                new Date().toISOString(),

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