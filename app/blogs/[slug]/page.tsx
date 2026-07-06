import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

import BlogRenderer from "@/app/components/blog/BlogRenderer";

export default async function BlogPage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {

    const { slug } = await params;

    const snapshot = await getDoc(
        doc(db, "blogs", slug)
    );

    if (!snapshot.exists()) {

        notFound();

    }

    const blog = snapshot.data();

    return (

        <BlogRenderer
            title={blog.title}
            excerpt={blog.excerpt}
            heroImage={blog.heroImage}
            content={blog.content}
        />

    );

}