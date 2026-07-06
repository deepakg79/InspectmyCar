import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import DeleteButton from "./DeleteButton";
type BlogMeta = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    heroImage?: string;
    date: string;
    readTime: string;
};

export default async function AdminBlogsPage() {
    let blogs: BlogMeta[] = [];

    try {
        const file = await fs.readFile(
            path.join(
                process.cwd(),
                "content",
                "blogs",
                "metadata.json"
            ),
            "utf8"
        );

        blogs = JSON.parse(file);
    } catch {
        blogs = [];
    }

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

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {blog.title}
                                </h2>

                                <p className="text-slate-500 mt-2">
                                    {blog.date} • {blog.readTime}
                                </p>

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