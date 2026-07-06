import { notFound } from "next/navigation";

import { adminDb } from "@/app/lib/firebaseAdmin";
import BlogForm from "../../BlogForm";

export default async function EditBlog({
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

    const data = snapshot.data();

    const blog = {

        ...data,

        seo: {

            title:
                data?.seo?.title ??
                data?.seoTitle ??
                data?.title ??
                "",

            description:
                data?.seo?.description ??
                data?.seoDescription ??
                data?.excerpt ??
                "",

        },

    };

    return (

        <BlogForm
            initialData={blog}
            editMode
        />

    );

}