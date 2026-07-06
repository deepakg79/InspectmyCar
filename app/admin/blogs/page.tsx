import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { adminDb } from "@/app/lib/firebaseAdmin";
import Image from "next/image";
type BlogMeta = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    heroImage?: string;
    publishedAt: string;
    readTime: string;
};

function formatDate(date: string) {

    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

}

export default async function AdminBlogsPage() {

    const snapshot = await adminDb
        .collection("blogs")
        .orderBy("publishedAt", "desc")
        .get();

    const blogs: BlogMeta[] = snapshot.docs.map(doc => ({
        ...(doc.data() as BlogMeta),
    }));

    return (

        <main className="bg-main min-h-screen">

            <section className="max-w-6xl mx-auto px-6 py-16">

                <div className="flex items-center justify-between mb-10">

                    <div>

                        <h1 className="heading text-4xl">
                            Blog Management
                        </h1>

                        <p className="subtext mt-2">
                            Create, edit and manage published blogs.
                        </p>

                    </div>

                    <Link
                        href="/admin/blogs/create"
                        className="btn-primary px-6 py-3"
                    >
                        + New Blog
                    </Link>

                </div>

                <div className="space-y-5">

                    {blogs.length === 0 && (

                        <div className="card-glass p-10 rounded-3xl text-center">

                            <h2 className="text-2xl font-bold mb-3">
                                No Blogs Yet
                            </h2>

                            <p className="text-slate-500">
                                Click "New Blog" to publish your first article.
                            </p>

                        </div>

                    )}

                    {blogs.map((blog) => (

                        <div
                            key={blog.slug}
                            className="card-glass rounded-2xl p-6 flex justify-between items-center"
                        >

                            <div className="flex items-start gap-5">

                                {blog.heroImage && (

                                    <Image
                                        src={blog.heroImage}
                                        alt={blog.title}
                                        width={120}
                                        height={72}
                                        className="rounded-xl object-cover border"
                                    />

                                )}

                                <div>

                                    <div className="flex items-center gap-3 mb-2">

                                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">

                                            {blog.category}

                                        </span>

                                    </div>

                                    <h2 className="text-2xl font-bold">

                                        {blog.title}

                                    </h2>

                                    <p className="text-slate-500 mt-2">

                                        {formatDate(blog.publishedAt)}
                                        {" • "}
                                        {blog.readTime}

                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-3">

                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="px-4 py-2 rounded-xl border"
                                >
                                    View
                                </Link>

                                <Link
                                    href={`/admin/blogs/edit/${blog.slug}`}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
                                >
                                    Edit
                                </Link>

                                <DeleteButton slug={blog.slug} />

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </main>

    );

}