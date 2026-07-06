import { notFound } from "next/navigation";

import { adminDb } from "@/app/lib/firebaseAdmin";
import BlogRenderer from "@/app/components/blog/BlogRenderer";

export default async function BlogPage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {

    const { slug } = await params;

    const snapshot = await adminDb
        .collection("blogs")
        .doc(slug)
        .get();

    if (!snapshot.exists) {

        notFound();

    }

    const blog = snapshot.data()!;

    // Fetch related blogs
    const relatedSnapshot = await adminDb
        .collection("blogs")
        .where("category", "==", blog.category)
        .where("published", "==", true)
        .limit(3)
        .get();

    let relatedBlogs = relatedSnapshot.docs
        .map(doc => {

            const data = doc.data();

            return {

                slug: data.slug,
                title: data.title,
                excerpt: data.excerpt,
                category: data.category,
                heroImage: data.heroImage,
                readTime: data.readTime,

            };

        })
        .filter(blog => blog.slug !== slug)
        .slice(0, 2);

    // If fewer than 2, fill with latest blogs
    if (relatedBlogs.length < 2) {

        const latestSnapshot = await adminDb
            .collection("blogs")
            .where("published", "==", true)
            .orderBy("publishedAt", "desc")
            .limit(5)
            .get();

        const latest = latestSnapshot.docs
            .map(doc => {

                const data = doc.data();

                return {

                    slug: data.slug,
                    title: data.title,
                    excerpt: data.excerpt,
                    category: data.category,
                    heroImage: data.heroImage,
                    readTime: data.readTime,

                };

            })
            .filter(blog =>
                blog.slug !== slug &&
                !relatedBlogs.some(
                    r => r.slug === blog.slug
                )
            );

        relatedBlogs = [
            ...relatedBlogs,
            ...latest,
        ].slice(0, 2);

    }

    return (

        <BlogRenderer
            title={blog.title}
            excerpt={blog.excerpt}
            heroImage={blog.heroImage}
            content={blog.content}
            relatedBlogs={relatedBlogs}
        />

    );

}