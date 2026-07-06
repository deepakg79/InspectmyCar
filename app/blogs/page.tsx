import Link from "next/link";
import fs from "fs/promises";
import path from "path";

type BlogMeta = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    heroImage?: string;
    date: string;
    readTime: string;
};
export default async function BlogsPage({
    searchParams,
}: {
    searchParams: Promise<{
        category?: string;
    }>;
}) {

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
    const { category } = await searchParams;

    const categories = [
        "All",
        ...new Set(
            blogs
                .map((blog) => blog.category)
                .filter(Boolean)
        ),
    ];

    const filteredBlogs =
        category && category !== "All"
            ? blogs.filter(
                (blog) => blog.category === category
            )
            : blogs;
    return (

        <main className="bg-main text-slate-900 min-h-screen">

            {/* HERO */}

            <section className="px-6 pt-32 pb-20 max-w-7xl mx-auto text-center">

                <span className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm mb-6">
                    InspectMyCar Knowledge Centre
                </span>

                <h1 className="heading text-4xl md:text-6xl leading-tight mb-6">
                    Car Buying Guides &
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                        Inspection Articles
                    </span>
                </h1>

                <p className="subtext text-lg max-w-3xl mx-auto leading-relaxed">
                    Expert guides covering Pre-Delivery Inspection (PDI),
                    car delivery checklists, ownership tips, buying advice,
                    dealership practices and everything you should know before
                    taking delivery of your new car.
                </p>

            </section>

            {/* ARTICLES */}

            <section className="px-6 pb-24 max-w-7xl mx-auto">

                {filteredBlogs.length === 0 ? (

                    <div className="card-glass rounded-3xl border border-slate-200 p-12 text-center">

                        <h2 className="heading text-2xl mb-3">
                            No Blogs Published Yet
                        </h2>

                        <p className="subtext">
                            Publish your first blog from the admin panel.
                        </p>

                    </div>

                ) : (

                    <div className="grid lg:grid-cols-2 gap-8">

                        {filteredBlogs.map((blog) => (

                            <article
                                key={blog.slug}
                                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                            >

                                {/* Accent */}

                                <div className="h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500" />

                                <div className="p-7">

                                    {/* Top */}

                                    <div className="flex items-center justify-between mb-5">

                                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">

                                            {blog.category}

                                        </span>

                                        <span className="text-sm text-slate-500">

                                            {blog.readTime}

                                        </span>

                                    </div>

                                    {/* Title */}

                                    <h2 className="text-2xl font-bold leading-snug text-slate-900 group-hover:text-indigo-600 transition">

                                        {blog.title}

                                    </h2>

                                    {/* Excerpt */}

                                    <p className="mt-4 text-slate-600 leading-7 line-clamp-3">

                                        {blog.excerpt}

                                    </p>

                                    {/* Footer */}

                                    <div className="mt-8 flex items-center justify-between">

                                        <span className="text-sm text-slate-500">

                                            {blog.date}

                                        </span>

                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            className="inline-flex items-center gap-2 font-semibold text-indigo-600 group-hover:gap-3 transition-all"
                                        >
                                            Read Article
                                            <span>→</span>
                                        </Link>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>
            {/* CATEGORIES */}

            <section className="px-6 pb-20 max-w-7xl mx-auto">

                <div className="card-glass rounded-3xl p-10 border border-slate-100">
                    <h2 className="heading text-3xl text-center mb-3">
                        Browse by Category
                    </h2>

                    <p className="subtext text-center mb-8">
                        Explore articles based on your interests.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">

                        {categories.map((item) => {

                            const active =
                                (category ?? "All") === item;

                            return (

                                <Link
                                    key={item}
                                    href={
                                        item === "All"
                                            ? "/blogs"
                                            : `/blogs?category=${encodeURIComponent(item)}`
                                    }
                                    className={`
                    px-4 py-2 rounded-xl text-sm font-semibold transition
                    ${active
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600"
                                        }
                `}
                                >
                                    {item}
                                </Link>

                            );

                        })}

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="px-6 pb-28">

                <div className="max-w-4xl mx-auto card-glass rounded-3xl border border-indigo-100 p-14 relative overflow-hidden text-center">

                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-6">
                        Need an Independent Car Inspection?
                    </h2>

                    <p className="subtext max-w-2xl mx-auto mb-8">
                        Our experts perform a comprehensive 299+ point
                        Pre-Delivery Inspection so you can take delivery
                        with complete confidence.
                    </p>

                    <div className="flex justify-center">

                        <Link
                            href="/car-pdi-pune"
                            className="btn-primary px-10 py-4"
                        >
                            Book Inspection
                        </Link>

                    </div>

                </div>

            </section>

        </main>

    );

}